"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const yauzl_promise_1 = __importDefault(require("yauzl-promise"));
const token = process.env.ODPT_AUTH_TOKEN;
if (token == null) {
    throw new Error('missing $ODPT_AUTH_TOKEN');
}
const uri = `https://api-tokyochallenge.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip?acl:consumerKey=${token}`;
const dirPath = './tmp/odpt';
fs_1.default.mkdirSync(dirPath, { recursive: true });
node_fetch_1.default(uri).then(async (res) => {
    const buffer = await res.buffer();
    const zipFile = await yauzl_promise_1.default.fromBuffer(buffer, { lazyEntries: true });
    await zipFile.walkEntries(async (entry) => {
        const filePath = path_1.default.resolve(dirPath, entry.fileName);
        const writeStream = fs_1.default.createWriteStream(filePath);
        const readStream = await zipFile.openReadStream(entry);
        readStream.pipe(writeStream);
        console.log(entry.getLastModDate(), entry.fileName);
    });
    await zipFile.close();
});
