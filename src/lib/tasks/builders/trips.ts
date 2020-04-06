// utils
import { CsvRowAsObj, parseCsvSync } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

export const buildOps = (
  data: CsvRowAsObj,
  agencyId: string,
  feedVersion: string,
): BulkOperation => ({
  updateOne: {
    filter: {
      __id: data.trip_id,
      __agencyId: agencyId,
    },
    update: {
      __routeId: data.route_id,
      __serviceId: data.service_id,
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
  const csv = parseCsvSync(dirPath, 'trips.txt');
  return csv.map((row) => buildOps(row, agencyId, feedVersion));
};

export default build;

export type TtripToRouteAndServiceMap = {
  [tripId: string]: {
    route_id: string;
    service_id: string;
  };
};

export const mapTripToRouteAndService: (dirPath: string) => TtripToRouteAndServiceMap = (
  dirPath,
) => {
  const csv = parseCsvSync(dirPath, 'trips.txt');
  return csv.reduce(
    (results: TtripToRouteAndServiceMap, row) => ({
      ...results,
      [row.trip_id]: {
        route_id: row.route_id,
        service_id: row.service_id,
      },
    }),
    {},
  );
};
