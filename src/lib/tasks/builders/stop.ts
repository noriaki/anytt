import CSV from 'csv-reader';

// utils
import { CsvRowAsObj, createCsvReaderStream, PromiseReturningBulkOps } from './utils';
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
    if (row.location_type === '0') {
      // this is child-stop
      if (parentToChildrenMap[row.parent_station] == null) {
        parentToChildrenMap[row.parent_station] = {
          children: [row],
        };
      } else {
        parentToChildrenMap[row.parent_station].children.push(row);
      }
    } else if (row.location_type === '1') {
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

export const buildOps = (
  data: CsvRowAsObj,
  agencyId: string,
  feedVersion: string,
): BulkOperation => ({
  updateOne: {
    filter: { __id: data.stop_id },
    update: {
      name: data.stop_name,
      loc: {
        type: 'Point',
        coordinates: [parseFloat(data.stop_lon), parseFloat(data.stop_lat)],
      },
      __agencyId: agencyId,
      __feedVersion: feedVersion,
    },
    upsert: true,
  },
});

const build: (
  dirPath: string,
  agencyId: string,
  feedVersion: string,
) => PromiseReturningBulkOps = async (dirPath, agencyId, feedVersion) => {
  const csv = createCsvReaderStream(dirPath, 'stops.txt');
  const stops = await combineStopName(csv);
  return stops.map(stop => buildOps(stop, agencyId, feedVersion));
};

export default build;
