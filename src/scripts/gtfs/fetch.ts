import fs from 'fs';
import fetch from 'node-fetch';
import yauzl from 'yauzl-promise';

const token = process.env.ODPT_AUTH_TOKEN;
const uri = `https://api-tokyochallenge.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip?acl:consumerKey=${token}`;

fetch(uri).then(async res => {
  const buffer = await res.buffer();
  const zipFile = await yauzl.fromBuffer(buffer, { lazyEntries: true });
  await zipFile.walkEntries(async entry => {
    const writeStream = fs.createWriteStream(`./tmp/${entry.fileName}`);
    const readStream = await zipFile.openReadStream(entry);
    readStream.pipe(writeStream);
    console.log(entry.getLastModDate(), entry.fileName);
  });
  await zipFile.close();
});
