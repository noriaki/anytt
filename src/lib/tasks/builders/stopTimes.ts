import transform from 'stream-transform';

import { mapTripToRouteAndService, TtripToRouteAndServiceMap } from './trips';
import { PromiseReturningBulkOps, CsvRowAsObj, createCsvReaderStream } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { toSecFor4am } from '~/lib/time';

export const createMapTripToRouteAndService: (
  dataMap: TtripToRouteAndServiceMap,
) => (data: CsvRowAsObj) => CsvRowAsObj = dataMap => data => ({
  ...data,
  ...dataMap[data.trip_id],
});

export type CombinedTimetable = {
  stop_id: string;
  route_id: string;
  service_id: string;
  stop_sequence: string;
  data: number[];
};
type TcombineTimetableMapper = {
  [k: string]: CombinedTimetable;
};

export const combineTimetable = async (
  // rows: (CsvRowAsObj & Omit<CombinedTimetable, 'data'>)[],
  rows: CsvRowAsObj[],
): Promise<CombinedTimetable[]> => {
  const mapper: TcombineTimetableMapper = {};
  for await (const row of rows) {
    const key = `${row.stop_id}:${row.route_id}:${row.service_id}`;
    if (mapper[key] == null) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { stop_id, route_id, service_id, stop_sequence } = row;
      mapper[key] = { stop_id, route_id, service_id, stop_sequence, data: [] };
    }
    mapper[key].data.push(toSecFor4am(row.departure_time));
  }
  return Object.values(mapper).map(m => {
    m.data.sort();
    return m;
  });
};

export const buildOps = (
  data: CombinedTimetable,
  agencyId: string,
  feedVersion: string,
): BulkOperation => ({
  updateOne: {
    filter: {
      __stopId: data.stop_id,
      __routeId: data.route_id,
      __serviceId: data.service_id,
    },
    update: {
      data: [],
      __agencyId: agencyId,
      __feedVersion: feedVersion,
    },
    upsert: true,
  },
});

const build: (
  dirPath: string,
  agencyId: string,
  feedVersion: string,
) => PromiseReturningBulkOps = async (dirPath, agencyId, feedVersion) => {
  const csv = createCsvReaderStream(dirPath, 'stop_times.txt');
  const dataMap = await mapTripToRouteAndService(dirPath);
  const dataMapper = transform(createMapTripToRouteAndService(dataMap));
  const timetables = await combineTimetable(csv.pipe(dataMapper));
  return timetables.map(timetable => buildOps(timetable, agencyId, feedVersion));

  // const ops: BulkOperation[] = [];
  // for await (const row of csv) {
  //   ops.push(buildOps(row, agencyId, feedVersion));
  // }
  // return ops;
};

export default build;
