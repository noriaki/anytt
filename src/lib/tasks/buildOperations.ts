import fs from 'fs';

import tasks, { buildDataDirPath, buildOpsFilePath, opsDirPath } from './tasks.config';
import buildBulkOperations from './builders';

const { mkdir, writeFile } = fs.promises;

const main = async () => {
  await mkdir(opsDirPath, { recursive: true });

  for await (const task of tasks.filter(t => t.type === 'gtfs')) {
    for await (const source of task.sources) {
      if (source.uri !== null) {
        const sourceDirPath = buildDataDirPath(source.key);
        const destFilePath = buildOpsFilePath(source.key);

        const ops = await buildBulkOperations(source.uri, sourceDirPath);
        await writeFile(destFilePath, JSON.stringify(ops, null, 2));
      }
    }
  }
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
