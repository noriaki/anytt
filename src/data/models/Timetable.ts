import { createSchema, Type, typedModel } from 'ts-mongoose';

export const TimetableSchema = createSchema(
  {
    schedule: Type.array().of(Type.number()),
    data: Type.array().of(Type.number()),
    sequence: Type.number(),
    __stopId: Type.string({ index: true }),
    __routeId: Type.string({ index: true }),
    __serviceId: Type.string({ index: true }),
    __agencyId: Type.string({ index: true }),
    __feedVersion: Type.string({ index: true }),
  },
  { timestamps: true },
);

export const collectionName = 'Timetable';
export const Timetable = typedModel(collectionName, TimetableSchema);

export default Timetable;
