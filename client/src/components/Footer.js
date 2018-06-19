import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 50,
    margin: '0 -8px -8px -8px'
  },
  text: {
    color: 'white',
    fontSize: 12,
    [theme.breakpoints.up('sm')]: {
      fontSize: 14
    },
  }
});

const Footer = ({ classes }) => <Paper className={classes.container}>
  <Typography className={classes.text} type="body1">© {new Date().getFullYear()} EZ Submittals</Typography>
  <Typography className={classes.text} type="body1">The safety forms manager you need</Typography>
</Paper>

export default withStyles(styles)(Footer);