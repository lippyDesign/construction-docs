import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import GenericForm from './formBuilder/GenericForm';

import { savePaymentInfo, updateFormInitialValues, updateUserProfile } from '../redux/actions';

const styles = theme => ({
  wrapper: {
    flex: 1
  },
  sectionPaper: {
    padding: 20,
    paddingBottom: 110
  },
  sectionPaperTwo: {
    marginTop: 16,
    padding: 20,
    paddingBottom: 110
  },
  sectionTitle: {
    textAlign: 'center'
  }
});

const accountInfoToBeCollected = [
  { title: 'First Name', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Last Name', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Company', mustBeFilledOut: false, inputType: 'text' },
  { title: 'Title', mustBeFilledOut: false, inputType: 'text' },
  { title: 'City', mustBeFilledOut: false, inputType: 'text' },
  { title: 'State', mustBeFilledOut: false, inputType: 'text' }
];

const paymentInfoToBeCollected = [
  { title: 'Card Number', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Exp Month', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Exp Year', mustBeFilledOut: true, inputType: 'text' },
  { title: 'CVC', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Name on card', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Card Address', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Card City', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Card State', mustBeFilledOut: true, inputType: 'text' },
  { title: 'Card Zip Code', mustBeFilledOut: true, inputType: 'text' }
];

class Account extends React.Component {

  // async componentDidMount() {
  //   await this.props.
  // }

  componentDidMount() {
    const { user } = this.props;
    this.props.updateFormInitialValues({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Company': user.company,
      'Title': user.title,
      'City': user.city,
      'State': user.state
    });
  }

  onAccountFormSubmit = formFields => {
    this.props.updateUserProfile({
      firstName: formFields['First Name'],
      lastName: formFields['Last Name'],
      company: formFields['Company'],
      title: formFields['Title'],
      city: formFields['City'],
      state: formFields['State']
    });
  }

  renderPublicProfile = () => {
    const { classes, user } = this.props;
    return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Public Profile
      </Typography>
       <GenericForm
        form='accountInfoForm'
        key='accountInfoForm'
        onSubmit={this.onAccountFormSubmit}
        fields={accountInfoToBeCollected}
        buttonTitle='Save Profile Info'
      />
    </Paper>
  }

  onPaymentFormSubmit = fields => {
    this.props.savePaymentInfo({
      number: fields['Card Number'],
      cvc: fields['CVC'],
      exp_month: fields['Exp Month'],
      exp_year: fields['Exp Year'],
      name: fields['Name on card'],
      address_line1: fields['Address 1'],
      address_line2: fields['Address 2'],
      address_city: fields['City'],
      address_state: fields['State'],
      address_zip: fields['Zip Code'],
      address_country: 'US'
    });
  }

  renderPaymentInfo = () => {
    const { classes } = this.props;
    return <Paper className={classes.sectionPaperTwo}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Payment Information
      </Typography>
       <GenericForm
        form='paymentInfoForm'
        key='paymentInfoForm'
        onSubmit={this.onPaymentFormSubmit}
        fields={paymentInfoToBeCollected}
        buttonTitle='Save Payment Info'
      />
    </Paper>
  }

  render() {
    if (!this.props.user) return <div />;
    return <div className={this.props.classes.wrapper}>
      {this.renderPublicProfile()}
      {this.renderPaymentInfo()}
    </div>;
  }
}

const mapStateToProps = state => {
  return { user: state.auth.user };
}

export default connect(mapStateToProps, { savePaymentInfo, updateFormInitialValues, updateUserProfile })(withStyles(styles, { withTheme: true })(Account));