// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// utils
import { CsvRowAsObj, createCsvReaderStream, parseCsvSync } from './utils';

export const buildOps = (data: CsvRowAsObj, key: string): BulkOperation => ({
  updateOne: {
    filter: { __id: data.agency_id },
    update: { key, name: data.agency_name, url: data.agency_url },
    upsert: true,
  },
});

export const extractAgencyId = (dirPath: string): string => {
  const csv = parseCsvSync(dirPath, 'agency.txt');
  return csv[0].agency_id;
};

type PromiseReturningBulkOps = Promise<BulkOperation[]>;

const build: (
  source: GtfsSourceIdentifier,
  dirPath: string,
) => PromiseReturningBulkOps = async (source, dirPath) => {
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
