import { DatabaseInfo } from '~/data/db';

// data
import geosearchFixtures from './geosearch.json';

type Tfixtures = {
  [target: string]: {
    model: string;
    data: any;
  };
};

const fixtures: Tfixtures = {
  geosearch: { model: 'Stop', data: geosearchFixtures },
};

export const importFixture = (db: DatabaseInfo, target: string) => {
  const { model, data } = fixtures[target];
  return db.connection.models[model].insertMany(data);
};

export const deleteModelsData = (db: DatabaseInfo) => {
  const models = db.connection.modelNames();
  const promises = models.map((m) => db.connection.models[m].deleteMany({}));
  return Promise.all(promises);
};
