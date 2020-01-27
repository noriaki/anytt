import { Connection, Model, Document } from 'mongoose';

import connectMongoDB from '~/data/db';
import { ResidenceDocument } from '~/data/models/Residence';

type MongooseModel = Model<Document, {}>;

describe('associations between Residence and Stop', () => {
  let connection: Connection;
  let Residence: MongooseModel;
  let Stop: MongooseModel;
  let Routing: MongooseModel;

  beforeEach(async () => {
    const ret = await connectMongoDB();
    connection = ret.connection;
    Residence = ret.models.Residence;
    Stop = ret.models.Stop;
    Routing = ret.models.Routing;
    await Promise.all([
      Residence.deleteMany({}),
      Stop.deleteMany({}),
      Routing.deleteMany({}),
    ]);
    await makeFixtures(Residence, Stop, Routing);
  });

  afterEach(() => connection.close());

  it('count', async () => {
    expect(await Residence.countDocuments()).toBe(2);
    expect(await Stop.countDocuments()).toBe(2);
    expect(await Routing.countDocuments()).toBe(3);
  });

  it('populate', async () => {
    const dt = (await Residence.findOne({ slug: 'dt' }).populate({
      path: 'stops',
      populate: { path: 'stop' },
    })) as ResidenceDocument;
    expect(dt).not.toBeNull();
    expect(dt).toHaveProperty('stops');
    expect(dt.stops).toHaveLength(2);
  });
});

const makeFixtures = async (
  residenceModel: MongooseModel,
  stopModel: MongooseModel,
  routingModel: MongooseModel,
): Promise<void> => {
  const [dt, pth] = await residenceModel.insertMany([
    { slug: 'dt', name: 'Deux Tours' },
    { slug: 'pth', name: 'パークタワー晴海' },
  ]);
  const [hrm3, hmc] = await stopModel.insertMany([
    { name: '晴海三丁目' },
    { name: 'ホテルマリナーズコート前' },
  ]);

  for (const residence of [dt, pth]) {
    await routingModel.update(
      { residence: residence._id, stop: hrm3._id, distance: 2 },
      {},
      { upsert: true },
    );
  }

  await routingModel.update(
    { residence: dt._id, stop: hmc._id, distance: 1 },
    {},
    { upsert: true },
  );
};
