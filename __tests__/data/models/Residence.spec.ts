import { Connection, Model, Document } from 'mongoose';

import connectMongoDB from '~/data/db';

describe('Residence Model', () => {
  let connection: Connection;
  let Residence: Model<Document, {}>;

  beforeEach(async () => {
    const ret = await connectMongoDB();
    connection = ret.connection;
    Residence = ret.models.Residence;
  });

  afterEach(() => {
    connection.close();
  });

  it('count', async () => {
    expect(await Residence.countDocuments()).toBe(0);
  });
});
