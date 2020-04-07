import { DatabaseInfo } from '~/data/db';
import { importFixture, deleteModelsData } from '../fixtures/helper';

describe('Relations between Stop/Route/Timetable', () => {
  let Stop: DatabaseInfo['models']['Stop'];
  let Route: DatabaseInfo['models']['Route'];
  let Timetable: DatabaseInfo['models']['Timetable'];

  beforeEach(async () => {
    const { db } = global;
    await importFixture(db, 'relations');
    Stop = db.models.Stop;
    Route = db.models.Route;
    Timetable = db.models.Timetable;
  });

  afterEach(async () => {
    await deleteModelsData(global.db);
  });

  it('imported fixtures count', async () => {
    expect(await Stop.countDocuments()).toBe(1);
    expect(await Route.countDocuments()).toBe(1);
    expect(await Timetable.countDocuments()).toBe(1);
  });

  it('Stop has many Timetables', async () => {
    const stop = await Stop.findOne().populate('timetables');
    expect(stop.timetables).toHaveLength(1);
    // eslint-disable-next-line no-underscore-dangle
    expect(stop.timetables[0]).toHaveProperty('__stopId', stop.__id);
  });
});
