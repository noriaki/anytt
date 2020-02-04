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
import { Route, Timetable } from '~/data/types';

type GuideBoardComponent = React.FC<{
  route: Route;
}>;

type pickTimetableF = (timetables: Timetable[], day: number) => Timetable | undefined;

const pickTimetable: pickTimetableF = (ts, d) => ts.find(t => t.calendar.includes(d));

const GuideBoard: GuideBoardComponent = ({ route }) => {
  const day = new Date().getDay();
  const timetable = pickTimetable(route.timetables, day);

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
      <Grid item container justify="space-between" alignItems="center">
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
        <Grid item className={styles.time}>
          <Typography>{timetable?.id}</Typography>
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
