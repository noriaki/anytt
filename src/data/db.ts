import mongoose from 'mongoose';

import { ResidenceSchema } from './models/Residence';
import { RoutingSchema } from './models/Routing';
import { StopSchema } from './models/Stop';

const connect = async () => {
  const connection = await mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  const Residence = connection.model('Residence', ResidenceSchema);
  const Stop = connection.model('Stop', StopSchema);
  const Routing = connection.model('Routing', RoutingSchema);

  return {
    connection,
    models: {
      Residence,
      Routing,
      Stop,
    },
  };
};

export default connect;
