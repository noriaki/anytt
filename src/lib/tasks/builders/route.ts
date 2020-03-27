// utils
import { CsvRowAsObj, PromiseReturningBulkOps, createCsvReaderStream } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

export const buildOps = (data: CsvRowAsObj): BulkOperation => ({
  updateMany: {
    filter: { __routeId: data.route_id },
    update: {
      __pRouteId: data.jp_parent_route_id,
      headsign: data.route_short_name,
    },
  },
});

const build: (dirPath: string) => PromiseReturningBulkOps = async dirPath => {
  const csv = createCsvReaderStream(dirPath, 'routes.txt');
  const ops: BulkOperation[] = [];
  for await (const row of csv) {
    ops.push(buildOps(row));
  }
  return ops;
};

export default build;
