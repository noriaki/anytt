import React from 'react';

// material-ui
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// styles
import styles from './Hero.module.css';

const Hero: React.FC = () => (
  <Typography variant="h5" component="h1" color="primary" align="center">
    Next.js with TypeScript
    <Button
      variant="contained"
      color="secondary"
      classes={{ root: styles.root }}
      className={styles.big}
      fullWidth
    >
      Subscribe
    </Button>
  </Typography>
);

export default Hero;
