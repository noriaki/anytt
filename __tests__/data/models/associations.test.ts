import { MongooseModel } from '~/data/db';
import { deleteModels, importFixtures } from '~/data/fixtures/helper';
import { ResidenceDocument } from '~/data/models/Residence';

describe('associations between Residence and Stop', () => {
  let Residence: MongooseModel;
  let Stop: MongooseModel;
  let Routing: MongooseModel;

  beforeEach(async () => {
    const { db } = global;
    const { models } = db;
    await importFixtures(db);
    Residence = models.Residence;
    Stop = models.Stop;
    Routing = models.Routing;
  });

  afterEach(async () => {
    await deleteModels(global.db);
  });

  it('count', async () => {
    expect(await Residence.countDocuments()).toBe(2);
    expect(await Stop.countDocuments()).toBe(3);
    expect(await Routing.countDocuments()).toBe(4);
  });

  it('populate', async () => {
    const dt = (await Residence.findOne({ slug: 'dt' }).populate({
      path: 'stops',
      populate: { path: 'stop' },
    })) as ResidenceDocument;
    expect(dt).not.toBeNull();
    expect(dt).toHaveProperty('stops');
    expect(dt.stops).toHaveLength(3);
  });
});
