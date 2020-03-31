import fs from 'fs';
import { resolve } from 'path';
import CSV from 'csv-reader';
import parse from 'csv-parse/lib/sync';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

// types
export type PromiseReturningBulkOps = Promise<BulkOperation[]>;
export type CsvRowAsObj = { [key: string]: string };

export const createCsvReaderStream = (dirPath: string, fileName: string): CSV => {
  const filePath = resolve(dirPath, fileName);
  return fs
    .createReadStream(filePath, 'utf8')
    .pipe(new CSV({ skipEmptyLines: true, asObject: true, trim: true }));
};

export const parseCsvSync = (dirPath: string, fileName: string): CsvRowAsObj[] => {
  const filePath = resolve(dirPath, fileName);
  return parse(fs.readFileSync(filePath, { encoding: 'utf8' }), {
    skip_empty_lines: true,
    columns: true,
    trim: true,
  });
};
