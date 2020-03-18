import fs from 'fs';
import { resolve } from 'path';
import CSV from 'csv-reader';

export type CsvRowAsObj = { [key: string]: string };

export const createCsvReaderStream = (dirPath: string, fileName: string): CSV => {
  const filePath = resolve(dirPath, fileName);
  return fs
    .createReadStream(filePath, 'utf8')
    .pipe(new CSV({ skipEmptyLines: true, asObject: true, trim: true }));
};
