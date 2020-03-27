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
