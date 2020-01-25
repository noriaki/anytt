import mongoose from 'mongoose';

import { collectionName, ResidenceSchema } from './models/Residence';

const connect = async () => {
  const connection = await mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  const Residence = connection.model(collectionName, ResidenceSchema);

  return {
    connection,
    models: {
      Residence,
    },
  };
};

export default connect;
