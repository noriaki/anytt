import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import yauzl from 'yauzl-promise';

const token = process.env.ODPT_AUTH_TOKEN;
const uri = `https://api-tokyochallenge.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip?acl:consumerKey=${token}`;
const dirPath = './tmp/odpt';

fs.mkdirSync(dirPath, { recursive: true });

fetch(uri).then(async res => {
  const buffer = await res.buffer();
  const zipFile = await yauzl.fromBuffer(buffer, { lazyEntries: true });
  await zipFile.walkEntries(async entry => {
    const filePath = path.resolve(dirPath, entry.fileName);
    const writeStream = fs.createWriteStream(filePath);
    const readStream = await zipFile.openReadStream(entry);
    readStream.pipe(writeStream);
    console.log(entry.getLastModDate(), entry.fileName);
  });
  await zipFile.close();
});
