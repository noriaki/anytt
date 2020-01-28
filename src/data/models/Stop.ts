import { createSchema, Type, ExtractDoc, ExtractProps, typedModel } from 'ts-mongoose';

export const StopSchema = createSchema(
  {
    name: Type.string({ required: true, index: true }),
    // lineId: Type.objectId({ required: true, index: true }),
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

StopSchema.virtual('residences', {
  ref: 'Routing',
  localField: '_id',
  foreignField: 'stop',
});

export const collectionName = 'Stop';
export const Stop = typedModel(collectionName, StopSchema);

// class StopClass extends Model {}
// StopSchema.loadClass(StopClass);

export type StopDocument = ExtractDoc<typeof StopSchema>;
export type StopProps = ExtractProps<typeof StopSchema>;
export type StopModel = typeof Stop;

export default Stop;
