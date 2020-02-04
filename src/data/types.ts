export type NextTime = {
  hour: number;
  minute: number;
};

export type TimetableHour = {
  hour: number;
  minutes: number[];
};

export type Timetable = {
  id: string;
  calendar: number[];
  data: TimetableHour[] | null;
};

export type Route = {
  id: string;
  headsign: string | null;
  dest: string;
  description: string;
  timetables: Timetable[];
};

export type Stop = {
  id: string;
  name: string;
  agency: {
    id: string;
    name: string;
  };
  routes: Route[];
};

export type StopWithPath = {
  distance: number;
  stop: Stop;
};

export type Residence = {
  id: string;
  slug: string;
  name: string;
  stops: StopWithPath[];
};
