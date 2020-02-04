import React from 'react';

// material-ui
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

// material-ui icons
import BackArrowIcon from '@material-ui/icons/ArrowBackIosRounded';
import ForwardArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

// styles
import styles from './GuideBoard.module.css';

// types
import { Route, Timetable, NextTime } from '~/data/types';

type GuideBoardComponent = React.FC<{
  route: Route;
}>;

type pickTimetableF = (timetables: Timetable[], day: number) => Timetable | undefined;

type nextTimeF = (timetable: Timetable, now: Date) => NextTime | null;

const pickTimetable: pickTimetableF = (ts, d) => ts.find(t => t.calendar.includes(d));

// prototyping
const nextTime: nextTimeF = (tt, now) => {
  if (tt.data === null) {
    return null;
  }
  const h = now.getHours();
  const m = now.getMinutes();
  const data = tt.data.find(t => t.hour === h);
  if (data == null) {
    return null;
  }
  const { hour, minutes } = data;
  const mi = minutes.findIndex(mt => mt > m);
  const minute = minutes[mi];
  return { hour, minute };
};

const GuideBoard: GuideBoardComponent = ({ route }) => {
  const now = new Date('2020-01-29 07:11:19');
  const day = now.getDay(); // Wednesday
  const timetable = pickTimetable(route.timetables, day);

  let n: NextTime | null;
  if (timetable != null) {
    n = nextTime(timetable, now);
  }

  return (
    <Grid container direction="column">
      <Grid item container justify="space-between" alignItems="center">
        <Grid item>
          <Typography>{route.dest}行</Typography>
        </Grid>
        {route.headsign && (
          <Grid item>
            <Chip size="small" label={route.headsign} />
          </Grid>
        )}
      </Grid>
      <Grid item container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Button
            color="secondary"
            startIcon={<BackArrowIcon />}
            classes={{
              root: styles['adjust-width'],
              label: styles.back,
              startIcon: styles.nomargin,
            }}
          >
            <Typography component="span" variant="caption">
              前発
            </Typography>
          </Button>
        </Grid>
        <Grid
          item
          container
          justify="space-around"
          alignItems="baseline"
          className={styles.time}
        >
          <Grid item>
            <Typography component="span" variant="h6">
              {n!.hour}:{n!.minute}
            </Typography>
            <Typography component="span" variant="body2">
              発
            </Typography>
          </Grid>
          <Grid item>
            <Typography component="span" variant="h4">
              {n!.minute - now.getMinutes()}
            </Typography>
            <Typography component="span" variant="body2">
              分
            </Typography>
            <Typography component="span" variant="h4">
              {60 - now.getSeconds()}
            </Typography>
            <Typography component="span" variant="body2">
              秒
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            endIcon={<ForwardArrowIcon />}
            classes={{
              root: styles['adjust-width'],
              label: styles.forward,
              endIcon: styles.nomargin,
            }}
          >
            <Typography component="span" variant="caption">
              次発
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GuideBoard;
