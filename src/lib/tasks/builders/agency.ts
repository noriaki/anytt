// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// utils
import { CsvRowAsObj, createCsvReaderStream } from './utils';

export const buildOps = (data: CsvRowAsObj, key: string): BulkOperation => ({
  updateOne: {
    filter: { __id: data.agency_id },
    update: { key, name: data.agency_name, url: data.agency_url },
    upsert: true,
  },
});

type PromiseReturningBuldOps = Promise<BulkOperation[]>;

const build = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBuldOps => {
  const csv = createCsvReaderStream(dirPath, 'agency.txt');
  const ops: BulkOperation[] = [];
  let firstLine = true;
  for await (const row of csv) {
    if (firstLine) {
      ops.push(buildOps(row, source.key));
      firstLine = false;
    }
  }
  return ops;
};

export default build;
