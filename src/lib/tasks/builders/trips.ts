// utils
import { CsvRowAsObj, PromiseReturningBulkOps, createCsvReaderStream } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

export const buildOps = (
  data: CsvRowAsObj,
  agencyId: string,
  feedVersion: string,
): BulkOperation => ({
  updateOne: {
    filter: { __id: data.trip_id },
    update: {
      __routeId: data.route_id,
      __serviceId: data.service_id,
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
  const csv = createCsvReaderStream(dirPath, 'trips.txt');
  const ops: BulkOperation[] = [];
  for await (const row of csv) {
    ops.push(buildOps(row, agencyId, feedVersion));
  }
  return ops;
};

export default build;

type TtripToRouteAndServiceMap = {
  [tripId: string]: {
    route_id: string;
    service_id: string;
  };
};

export const mapTripToRouteAndService: (
  dirPath: string,
) => Promise<TtripToRouteAndServiceMap> = async dirPath => {
  const csv = createCsvReaderStream(dirPath, 'trips.txt');
  const tripToRouteAndServiceMap: TtripToRouteAndServiceMap = {};
  for await (const row of csv) {
    tripToRouteAndServiceMap[row.trip_id] = {
      route_id: row.route_id,
      service_id: row.service_id,
    };
  }
  return tripToRouteAndServiceMap;
};
