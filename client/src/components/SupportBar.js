import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  supportBar: {
    marginLeft: -9,
    marginRight: -9,
    marginTop: -1,
    backgroundColor: '#E0E0E0'
  },
};

function SupportBar({ classes, children}) {
  return <Toolbar className={classes.supportBar}>
    {children}
  </Toolbar>
}

export default withStyles(styles)(SupportBar);