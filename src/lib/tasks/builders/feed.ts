// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// utils
import { CsvRowAsObj, createCsvReaderStream, parseCsvSync, PromiseReturningBulkOps } from './utils';

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

export const extractFeedVersion = (dirPath: string): string => {
  const csv = parseCsvSync(dirPath, 'feed_info.txt');
  return csv[0].feed_version;
};

export const setup: (
  source: GtfsSourceIdentifier,
  dirPath: string,
) => PromiseReturningBulkOps = async (source, dirPath) => {
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
