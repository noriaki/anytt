import { mapTripToRouteAndService, TtripToRouteAndServiceMap } from './trips';
import { CsvRowAsObj, parseCsvSync } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { toSecFor4am } from '~/lib/time';

export const createMapTripToRouteAndService: (
  dataMap: TtripToRouteAndServiceMap,
) => (data: CsvRowAsObj) => CsvRowAsObj = (dataMap) => (data) => ({
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

export const combineTimetable = (rows: CsvRowAsObj[]): CombinedTimetable[] => {
  const mapper: TcombineTimetableMapper = {};
  for (const row of rows) {
    const key = `${row.stop_id}:${row.route_id}:${row.service_id}`;
    if (mapper[key] == null) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { stop_id, route_id, service_id, stop_sequence } = row;
      mapper[key] = { stop_id, route_id, service_id, stop_sequence, data: [] };
    }
    mapper[key].data.push(toSecFor4am(row.departure_time));
  }
  return Object.values(mapper).map((m) => {
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
) => BulkOperation[] = (dirPath, agencyId, feedVersion) => {
  const csv = parseCsvSync(dirPath, 'stop_times.txt');
  const dataMap = mapTripToRouteAndService(dirPath);
  const dataMapper = createMapTripToRouteAndService(dataMap);
  const timetables = combineTimetable(csv.map(dataMapper));
  return timetables.map((t) => buildOps(t, agencyId, feedVersion));
};

export default build;
