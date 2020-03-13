import { createSchema, Type, typedModel } from 'ts-mongoose';

export const FeedSchema = createSchema(
  {
    uri: Type.string({ required: true, unique: true, index: true }),
    version: Type.string(),
    inProcessing: Type.boolean(),
  },
  { timestamps: true },
);

export const collectionName = 'Feed';
export const Feed = typedModel(collectionName, FeedSchema);

export default Feed;
