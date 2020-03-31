import { resolve } from 'path';
import { combineTimetable } from '~/lib/tasks/builders/stopTimes';
import { parseCsvSync, CsvRowAsObj } from '~/lib/tasks/builders/utils';

describe('builders/stopTimes#combineTimetable', () => {
  let data: CsvRowAsObj[];
  beforeEach(() => {
    data = parseCsvSync(resolve(__dirname, 'fixtures'), 'stop_times.txt');
  });

  it('should returning ', async () => {
    const expected = {
      stop_id: '1253-01',
      route_id: '72101-2',
      service_id: '81-170',
      data: [24540, 27720, 30660, 37740, 44100, 59340],
    };
    const subjects = await combineTimetable(data);
    expect(subjects).toHaveLength(5);
    const subject = subjects.find(
      s =>
        s.stop_id === expected.stop_id &&
        s.route_id === expected.route_id &&
        s.service_id === expected.service_id,
    );
    expect(subject).toMatchObject(expected);
  });
});
