// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// builders
import { setup, teardown } from './feed';
import buildAgency from './agency';

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
    { model: 'Agency', ops: await buildAgency(source, dirPath) },
    { model: 'Feed', ops: teardown(source) },
  ];
};

export default buildBulkOperations;
