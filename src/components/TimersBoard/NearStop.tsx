import React, { Fragment } from 'react';

// material-ui
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

// material-ui icons
import WalkIcon from '@material-ui/icons/DirectionsWalkRounded';

// styles
import styles from './NearStop.module.css';

// components
import GuideBoard from './GuideBoard';

// types
import { StopWithPath } from '~/data/types';

type NearStopComponent = React.FC<{
  target: StopWithPath;
}>;

const calcTraversalTime = (d: number): number => Math.round(d / 60);

const NearStop: NearStopComponent = ({ target }) => {
  const { distance, stop } = target;
  const time = calcTraversalTime(distance);

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid item className={styles.item}>
        <Chip size="small" icon={<WalkIcon />} label={`${time}分`} />
      </Grid>
      <Grid item className={styles.stop}>
        <Card>
          <CardHeader
            className={styles.header}
            title={stop.name}
            subheader={stop.agency.name}
            titleTypographyProps={{ variant: 'body1' }}
            subheaderTypographyProps={{ variant: 'body2' }}
          />
          <CardContent>
            {stop.routes.map((route, i) => (
              <Fragment key={route.id}>
                {i > 0 && <Divider className={styles.divider} />}
                <GuideBoard route={route} />
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default NearStop;
