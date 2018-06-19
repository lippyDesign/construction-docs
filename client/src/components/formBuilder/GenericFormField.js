import React from 'react';
import TextField from '@material-ui/core/TextField';

const GenericTextField = (props) => {
  const { input, label, ...custom } = props;
  return <TextField
    label={label}
    {...custom}
    {...input}
  />
}

export default GenericTextField;