import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import GenericFormField from './GenericFormField';

class GenericForm extends React.Component {
  render() {
    const { handleSubmit, fields, form, buttonTitle, doNotRenderButton, disabled } = this.props;
    const button = doNotRenderButton ? <span /> :
      <Button type="submit" variant="raised" color="primary" style={{ marginTop: 30, marginBottom: 30, float: 'right' }}>
        {buttonTitle || 'Submit'}
      </Button>;

    return <form form={form} onSubmit={handleSubmit}>
      {fields.map(({ title, mustBeFilledOut, inputType, multiline }) => <Field
        key={`key-${title}`}
        required={mustBeFilledOut}
        name={title}
        component={GenericFormField}
        label={title}
        margin="normal"
        fullWidth
        disabled={disabled}
        multiline={multiline}
        rows={4}
        type={inputType || 'text'}
      />)}
      {button}
  </form>
  }
}

const initializeFromStateForm = reduxForm({
  enableReinitialize : true
})(GenericForm);

const mapStateToProps = state => {
  return { initialValues: state.util.formInitialValues };
}

const FormWithInitalValues = connect(mapStateToProps)(initializeFromStateForm);

export default FormWithInitalValues;