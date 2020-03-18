import fs from 'fs';
import { resolve } from 'path';
import CSV from 'csv-reader';

import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

const createCsvStream = (dirPath: string): CSV => {
  return fs
    .createReadStream(resolve(dirPath, 'feed_info.txt'), 'utf8')
    .pipe(new CSV({ skipEmptyLines: true, asObject: true, trim: true }));
};

type rowAsObj = { [key: string]: string };

export const buildOpsForSetup = (
  data: rowAsObj,
  source: GtfsSourceIdentifier,
): BulkOperation => ({
  updateOne: {
    filter: { uri: source.uri },
    update: { key: source.key, version: data.feed_version, isProcessing: true },
    upsert: true,
  },
});

type PromiseReturningBuldOps = Promise<BulkOperation[]>;

export const setup = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBuldOps => {
  const csv = createCsvStream(dirPath);
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
