import CSV from 'csv-reader';

// types
// import { BulkOperation } from '~/lib/types/mongodb.bulkOps';
// import { GtfsSourceIdentifier } from '../tasks.config';

// utils
import { CsvRowAsObj, createCsvReaderStream } from './utils';
import { GtfsSourceIdentifier } from '../tasks.config';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

type TparentToChildrenMap = {
  [parentId: string]: {
    name?: string;
    children: CsvRowAsObj[];
  };
};

export const combineStopName = async (
  rows: CSV | CsvRowAsObj[],
): Promise<CsvRowAsObj[]> => {
  const parentToChildrenMap: TparentToChildrenMap = {};
  for await (const row of rows) {
    // this is child-stop
    if (row.parent_station !== '') {
      if (parentToChildrenMap[row.parent_station] == null) {
        parentToChildrenMap[row.parent_station] = {
          children: [row],
        };
      } else {
        parentToChildrenMap[row.parent_station].children.push(row);
      }
    }
    // this is parent-stop
    if (parentToChildrenMap[row.stop_id] == null) {
      parentToChildrenMap[row.stop_id] = {
        name: row.stop_name,
        children: [],
      };
    } else {
      parentToChildrenMap[row.stop_id].name = row.stop_name;
    }
  }
  return Object.keys(parentToChildrenMap).reduce(
    (results: CsvRowAsObj[], parentStopId: string): CsvRowAsObj[] => {
      const { name, children } = parentToChildrenMap[parentStopId];
      children.forEach((child, i) => {
        const suffix = child.stop_name === 'のりば' ? i + 1 : '';
        const stopName = `${name}${child.stop_name}${suffix}`;
        results.push({ ...child, stop_name: stopName });
      });
      return results;
    },
    [],
  );
};

export const buildOps = (data: CsvRowAsObj, key: string): BulkOperation => {
};

type PromiseReturningBuldOps = Promise<BulkOperation[]>;

const build = async (
  source: GtfsSourceIdentifier,
  dirPath: string,
): PromiseReturningBuildOps => {
  const csv = createCsvReaderStream(dirPath, 'stops.txt');
  const stops = await combineStopName(csv);
  return stops.map(stop => buildOps(stop, source.key));
};

export default build;
