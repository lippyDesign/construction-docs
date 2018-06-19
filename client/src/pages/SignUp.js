import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import SupportBar from '../components/SupportBar';
import GenericForm from '../components/formBuilder/GenericForm';

import { signUpWithEmailAndPassword } from '../redux/actions';

import googlePicture from '../images/google.png';

const formToRender = {
  id: 'signUpForm',
  infoToBeCollected: [
    { title: 'Email', mustBeFilledOut: true, inputType: 'email' },
    { title: 'Password', mustBeFilledOut: true, inputType: 'password' },
    { title: 'Confirm Password', mustBeFilledOut: true, inputType: 'password' }
  ]
}

class SignUp extends React.Component {
  onFormSubmit = formValues => {
    this.props.signUpWithEmailAndPassword({
      email: formValues['Email'],
      password: formValues['Password'],
      confirmPassword: formValues['Confirm Password']
    });
  }

  renderLoginWithGoogleSection = () => {
    const { classes } = this.props;
    return <div className={classes.signUpWithGoogleWrapper}>
      <Typography variant="subheading" noWrap className={classes.mainToolbarTitle}>
        Sign up with Google
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

  renderSignUpWithEmailAndPasswordForm = () => {
    return <GenericForm
      form={formToRender.id}
      onSubmit={this.onFormSubmit}
      fields={formToRender.infoToBeCollected}
      buttonTitle='Sign Up'
    />;
  }

  render() {
    const { authInProgress, classes, error } = this.props;
    const pageToolbar = <SupportBar>
      <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
        Sign Up
      </Typography>
    </SupportBar>;
    if (authInProgress) {
      return <div className={classes.page}>
        {pageToolbar}
        <div className={classes.wrapper}>
          <CircularProgress size={50} />
        </div>
      </div>
    }
    return <div className={classes.page}>
      {pageToolbar}
      <div className={classes.wrapper}>
        <div className={classes.forms}>
          {this.renderLoginWithGoogleSection()}
          <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
            OR
          </Typography>
          <Typography variant="title" noWrap className={classes.errorText}>
            {error}
          </Typography>
          {this.renderSignUpWithEmailAndPasswordForm()}
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
    height: 560,
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

export default connect(mapStateToProps, { signUpWithEmailAndPassword })(withStyles(styles, { withTheme: true })(SignUp));