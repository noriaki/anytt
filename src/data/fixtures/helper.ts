import { DatabaseInfo } from '~/data/db';

const residences = [
  { slug: 'dt', name: 'Deux Tours' },
  { slug: 'pth', name: 'パークタワー晴海' },
];

const stops = [
  { name: 'ドゥトゥール' },
  { name: '晴海三丁目' },
  { name: 'ホテルマリナーズコート前' },
];

export const deleteModels = (db: DatabaseInfo) => {
  const models = db.connection.modelNames();
  return Promise.all(models.map(name => db.connection.models[name].deleteMany({})));
};

export const importFixtures = async (db: DatabaseInfo) => {
  const { Residence, Stop, Routing } = db.models;
  const [dt, pth] = await Residence.insertMany(residences);
  const [dstop, hrm3, hmc] = await Stop.insertMany(stops);

  for (const residence of [dt, pth]) {
    await Routing.updateOne(
      { residence: residence.id, stop: hrm3.id, distance: 50 },
      {},
      { upsert: true },
    );
  }

  await Routing.updateOne(
    { residence: dt.id, stop: dstop.id, distance: 0 },
    {},
    { upsert: true },
  );

  await Routing.updateOne(
    { residence: dt.id, stop: hmc.id, distance: 100 },
    {},
    { upsert: true },
  );
};
