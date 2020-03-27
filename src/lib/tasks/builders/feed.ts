// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// utils
import { CsvRowAsObj, createCsvReaderStream } from './utils';

export const buildOpsForSetup = (
  data: CsvRowAsObj,
  source: GtfsSourceIdentifier,
): BulkOperation => ({
  updateOne: {
    filter: { uri: source.uri },
    update: { key: source.key, version: data.feed_version, isProcessing: true },
    upsert: true,
  },
});

type PromiseReturningBulkOps = Promise<BulkOperation[]>;

export const setup = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBulkOps => {
  const csv = createCsvReaderStream(dirPath, 'feed_info.txt');
  const ops: BulkOperation[] = [];
  let firstLine = true;
  for await (const row of csv) {
    if (firstLine) {
      ops.push(buildOpsForSetup(row, source));
      firstLine = false;
    }
  }
  return ops;
};

export const buildOpsForTeardown = (uri: string): BulkOperation => ({
  updateOne: {
    filter: { uri },
    update: { isProcessing: false },
  },
});

export const teardown = (source: GtfsSourceIdentifier): BulkOperation[] => [
  buildOpsForTeardown(source.uri),
];
