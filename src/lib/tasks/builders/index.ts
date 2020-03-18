// import fs from 'fs';
// import { resolve } from 'path';
// import csvParseSync from 'csv-parse/lib/sync';

// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

// builders
import { setup, teardown } from './feed';
import { GtfsSourceIdentifier } from '../tasks.config';

// const { readFile } = fs.promises;

// const readFileOptions = { encoding: 'utf8' } as const;
// const csvParseOptions = { columns: true, skip_empty_lines: true, trim: true } as const;

// const readAndParse = async (dirPath: string, fileName: string) => {
//   const file = await readFile(resolve(dirPath, fileName), readFileOptions);
//   return csvParseSync(file, csvParseOptions);
// };

type BulkOpsWithModel = {
  model: string;
  ops: BulkOperation[];
};
type PromiseReturningBulkOpsWithModels = Promise<BulkOpsWithModel[]>;

const buildBulkOperations = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBulkOpsWithModels => {
  // const csv = await readAndParse(dirPath, 'feed_info.txt');
  // const ops: BulkOpsWithModel[] = [];
  return [
    { model: 'Feed', ops: await setup(source, dirPath) },
    { model: 'Feed', ops: teardown(source) },
  ];
};

export default buildBulkOperations;
