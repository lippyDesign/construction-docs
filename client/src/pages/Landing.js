import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  page: {
    flex: 1
  }
}

const Landing = ({ classes }) => {
  return (
    <div className={classes.page}>
      <h1 style={{ textAlign: 'center' }}>
        Safety Forms!
      </h1>
      <p style={{ textAlign: 'center' }}>Make forms</p>
    </div>
  );
};

export default withStyles(styles)(Landing);
