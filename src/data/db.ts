import mongoose, { Connection, Model, Document } from 'mongoose';

import { ResidenceSchema } from './models/Residence';
import { StopSchema } from './models/Stop';
import { RoutingSchema } from './models/Routing';

export type MongooseModel = Model<Document, {}>;

export const createModels = (connection: Connection) => ({
  Residence: connection.model('Residence', ResidenceSchema),
  Stop: connection.model('Stop', StopSchema),
  Routing: connection.model('Routing', RoutingSchema),
});

export const connect = async () => {
  let { connection } = mongoose;
  if (connection.readyState !== connection.states.connected) {
    connection = await mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  }

  const models = createModels(connection);

  return { connection, models };
};

export const disconnect = async () => {
  const { connection } = mongoose;
  if (connection.readyState === connection.states.connected) {
    await mongoose.disconnect();
  }
};

export default connect;
