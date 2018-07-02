import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import landingMobilePic from '../images/landingMobile.png';
import landingDesktopPic from '../images/landingDesktop.png';

const additionalDetails = [
  { title: 'Easy To Use', icon: <PermIdentityIcon style={{ fontSize: 36 }} />, text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  { title: 'Lightning Fast', icon: <PermIdentityIcon style={{ fontSize: 36 }} />, text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  { title: 'Some Text 3', icon: <PermIdentityIcon style={{ fontSize: 36 }} />, text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
];

const styles = theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  jumbotron: {
    width: '100%',
    height: 450,
    marginLeft: -8,
    marginRight: -8,
    backgroundImage: `url("${landingMobilePic}")`,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    position: 'relative',
    ['@media (min-width:375px)']: { // eslint-disable-line no-useless-computed-key
      height: 600
    },
    [theme.breakpoints.up('md')]: {
      height: 700,
      backgroundImage: `url("${landingDesktopPic}")`
    }
  },
  darkenOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(68, 67, 60, 0.6)',
  },
  display3: {
    textAlign: 'center',
    color: '#fff',
    zIndex: 1
  },
  subheading: {
    color: '#fff',
    zIndex: 1,
    letterSpacing: 1.1
  },
  signUpButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#009688'
  },
  additionalDetails: {
    paddingTop: 40,
    paddingBottom: 40,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 1400
    }
  },
  card: {
    margin: 8,
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      width: '30%',
      paddingTop: 30,
      paddingBottom: 30
    }
  }
})

const Landing = ({ classes, history }) => {
  return (
    <div className={classes.page}>
      <div className={classes.jumbotron}>
        <div className={classes.darkenOverlay} />
        <Typography variant="display3" className={classes.display3}>
          EZ Dailies
        </Typography>
        <Typography variant="subheading" className={classes.subheading}>
          Take your form management to the next level
        </Typography>
        <Button variant="raised" color="primary" className={classes.signUpButton} onClick={() => history.push('/signup')}>
          Sign up for free
        </Button>
      </div>
      <div className={classes.additionalDetails}>
        {additionalDetails.map(({ title, icon, text}) => <Card className={classes.card} key={title}>
          <CardContent>
            {icon}
            <Typography variant="headline" component="h2">{title}</Typography>
            <Typography component="p">{text}</Typography>
          </CardContent>
        </Card>)}
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Landing);
