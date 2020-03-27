// types
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
import { GtfsSourceIdentifier } from '../tasks.config';

// builders
import { setup, teardown, extractFeedVersion } from './feed';
import buildAgency, { extractAgencyId } from './agency';
import buildStop from './stop';

type BulkOpsWithModel = {
  model: string;
  ops: BulkOperation[];
};
type PromiseReturningBulkOpsWithModels = Promise<BulkOpsWithModel[]>;

const buildBulkOperations = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBulkOpsWithModels => {
  const agencyId = await extractAgencyId(dirPath);
  const feedVersion = await extractFeedVersion(dirPath);
  return [
    { model: 'Feed', ops: await setup(source, dirPath) },
    { model: 'Agency', ops: await buildAgency(source, dirPath) },
    { model: 'Stop', ops: await buildStop(dirPath, agencyId, feedVersion) },
    { model: 'Feed', ops: teardown(source) },
  ];
};

export default buildBulkOperations;
