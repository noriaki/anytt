import fs from 'fs';
import { resolve } from 'path';
import CSV from 'csv-reader';

import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

const createCsvStream = (dirPath: string): CSV => {
  return fs
    .createReadStream(resolve(dirPath, 'agency.txt'), 'utf8')
    .pipe(new CSV({ skipEmptyLines: true, asObject: true, trim: true }));
};

type rowAsObj = { [key: string]: string };

export const buildOps = (data: rowAsObj, key: string): BulkOperation => ({
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
  const csv = createCsvStream(dirPath);
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
