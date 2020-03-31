"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const yauzl_promise_1 = __importDefault(require("yauzl-promise"));
const tasks_config_1 = __importDefault(require("./tasks.config"));
const mkdirAsync = util_1.default.promisify(fs_1.default.mkdir);
const buildUri = (source) => {
    var _a;
    const uri = new URL(source.uri);
    if (((_a = source.auth) === null || _a === void 0 ? void 0 : _a.type) === 'params') {
        if (source.auth.key == null || source.auth.value == null) {
            throw new Error('`source.auth.key` and `source.auth.value` are required.');
        }
        let value = '';
        if (typeof source.auth.value === 'string') {
            value = source.auth.value;
        }
        else if (source.auth.value.type === 'process.env') {
            const envValue = process.env[source.auth.value.name];
            if (envValue == null) {
                throw new Error(`missing $${source.auth.value.name}`);
            }
            value = envValue;
        }
        uri.searchParams.append(source.auth.key, value);
    }
    return uri;
};
const fetchAndStore = (source, outDirPath) => {
    const uri = buildUri(source);
    return node_fetch_1.default(uri).then(async (res) => {
        const buffer = await res.buffer();
        const zipFile = await yauzl_promise_1.default.fromBuffer(buffer, { lazyEntries: true });
        await zipFile.walkEntries(async (entry) => {
            const filePath = path_1.default.resolve(outDirPath, entry.fileName);
            const writeStream = fs_1.default.createWriteStream(filePath);
            const readStream = await zipFile.openReadStream(entry);
            readStream.pipe(writeStream);
            console.log(entry.getLastModDate(), entry.fileName);
        });
        await zipFile.close();
    });
};
const main = async () => {
    await Promise.all(tasks_config_1.default.map(task => {
        if (task.type !== 'gtfs') {
            return;
        }
        return Promise.all(task.sources.map(async (source) => {
            if (source.uri === null) {
                return;
            }
            const outDirPath = path_1.default.resolve('tmp/data', source.key);
            await mkdirAsync(outDirPath, { recursive: true });
            await fetchAndStore(source, outDirPath);
        }));
    }));
};
main().catch(err => {
    console.error(err);
    process.exit(1);
});
