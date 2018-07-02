import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import SupportBar from '../components/SupportBar';
import GenericForm from '../components/formBuilder/GenericForm';

import { loginWithEmailAndPassword } from '../redux/actions';

import googlePicture from '../images/google.png';

const formToRender = {
  id: 'loginForm',
  infoToBeCollected: [
    { title: 'Email', mustBeFilledOut: true, inputType: 'email' },
    { title: 'Password', mustBeFilledOut: true, inputType: 'password' }
  ]
}

class Login extends React.Component {
  onFormSubmit = formValues => {
    this.props.loginWithEmailAndPassword({
      email: formValues['Email'],
      password: formValues['Password']
    });
  }

  renderLoginWithGoogleSection = () => {
    const { classes } = this.props;
    return <div className={classes.signUpWithGoogleWrapper}>
      <Typography variant="subheading" noWrap className={classes.mainToolbarTitle}>
        Sign in with Google
      </Typography>
      <a href='/auth/google'>
        <img
          src={googlePicture}
          alt='sign up with google'
          className={classes.signUpWithGoogleImage}
        />
      </a>
    </div>;
  }

  renderLoginWithEmailAndPasswordForm = () => {
    return <GenericForm
      form={formToRender.id}
      onSubmit={this.onFormSubmit}
      fields={formToRender.infoToBeCollected}
      buttonTitle='Sign In'
    />;
  }

  render() {
    const { authInProgress, classes, error } = this.props;
    if (authInProgress) {
      return <div className={classes.page}>
        <SupportBar>
          <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
            Sign In
          </Typography>
        </SupportBar>
        <div className={classes.wrapper}>
          <CircularProgress size={50} />
        </div>
      </div>
    }
    return <div className={classes.page}>
      <SupportBar>
        <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
          Sign In
        </Typography>
      </SupportBar>
      <div className={classes.wrapper}>
        <div className={classes.forms}>
          {this.renderLoginWithGoogleSection()}
          <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
            OR
          </Typography>
          <Typography variant="title" noWrap className={classes.errorText}>
            {error}
          </Typography>
          {this.renderLoginWithEmailAndPasswordForm()}
        </div>
      </div>
    </div>;
  }
}

const styles = theme => ({
  page: {
    flex: 1,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 440,
    ['@media (min-width:375px)']: { // eslint-disable-line no-useless-computed-key
      height: 630
    },
    [theme.breakpoints.up('md')]: {
      height: 820
    }
  },
  mainToolbarTitle: {
    textAlign: 'center',
    width: '100%'
  },
  errorText: {
    textAlign: 'center',
    width: '100%',
    color: 'red',
    marginTop: 5
  },
  signUpWithGoogleWrapper: {
    padding: 25,
    textAlign: 'center'
  },
  signUpWithGoogleImage: {
    width: 75,
    cursor: 'pointer'
  }
});

const mapStateToProps = state => {
  return { authInProgress: state.auth.authInProgress, error: state.auth.error };
}

export default connect(mapStateToProps, { loginWithEmailAndPassword })(withStyles(styles, { withTheme: true })(Login));