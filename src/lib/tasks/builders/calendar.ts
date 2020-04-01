// utils
import { CsvRowAsObj, parseCsvSync } from './utils';
import { BulkOperation } from '~/lib/types/mongodb.bulkOps';

const dayOfTheWeekIndexer = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

type CalendarDays = typeof dayOfTheWeekIndexer[number];
type InBiz = '1';
type NotBiz = '0';
export type ScheduleDays = {
  [day in CalendarDays]: InBiz | NotBiz;
};
export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export const convertSchedule: (days: ScheduleDays) => DayOfWeek[] = (days) =>
  dayOfTheWeekIndexer.reduce((results: DayOfWeek[], day) => {
    if (days[day] === '1') {
      results.push(dayOfTheWeekIndexer.findIndex((dow) => dow === day));
    }
    return results;
  }, []);

export const buildOps = (data: CsvRowAsObj): BulkOperation => {
  const days = dayOfTheWeekIndexer.reduce(
    (results, day) => ({ ...results, [day]: data[day] }),
    {},
  );
  return {
    updateMany: {
      filter: { __serviceId: data.service_id },
      update: {
        schedule: convertSchedule(days),
      },
    },
  };
};

const build: (dirPath: string) => BulkOperation[] = (dirPath) => {
  const csv = parseCsvSync(dirPath, 'calendar.txt');
  return csv.map((row) => buildOps(row));
};

export default build;
