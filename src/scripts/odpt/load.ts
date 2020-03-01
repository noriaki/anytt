import fs from 'fs';
import path from 'path';
import CSV from 'csv-reader';

const inputFilePath = path.resolve('./tmp/odpt/feed_info.txt');
const inputStream = fs.createReadStream(inputFilePath, 'utf8');

inputStream
  .pipe(new CSV({ skipEmptyLines: true, asObject: true, trim: true }))
  .on('data', row => {
    console.log(row);
  })
  .on('end', () => {
    console.log('end');
  });
