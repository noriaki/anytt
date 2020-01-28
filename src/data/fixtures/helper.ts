import connectMongoDB from '~/data/db';

const residences = [
  { slug: 'dt', name: 'Deux Tours' },
  { slug: 'pth', name: 'パークタワー晴海' },
];

const stops = [
  { name: 'ドゥトゥール' },
  { name: '晴海三丁目' },
  { name: 'ホテルマリナーズコート前' },
];

export const deleteModels = async () => {
  const { connection } = await connectMongoDB();
  connection.deleteModel(/.+/); // every model
};

export const dropCollections = async () => {
  const { connection } = await connectMongoDB();
  const collections = Object.keys(connection.collections);
  return Promise.all(collections.map(name => connection.dropCollection(name)));
};

export const importFixtures = async () => {
  const {
    models: { Residence, Stop, Routing },
  } = await connectMongoDB();
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
