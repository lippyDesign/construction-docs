import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import formsReducer from './formsReducer';
import utilReducer from './utilReducer';
import projectsReducer from './projectsReducer';
import usersReducer from './usersReducer';

export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  forms: formsReducer,
  util: utilReducer,
  projects: projectsReducer,
  users: usersReducer
});
