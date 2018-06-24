import {
  FETCH_AVAILABLE_FORMS_START,
  FETCH_AVAILABLE_FORMS_SUCCESS,
  FETCH_AVAILABLE_FORMS_ERROR,
  FETCH_USER_FORMS_START,
  FETCH_USER_FORMS_SUCCESS,
  FETCH_USER_FORMS_ERROR,
  HANDLE_FORM_SELECT,
  SUBMIT_FORM_START,
  SUBMIT_FORM_ERROR,
  SUBMIT_FORM_SUCCESS,
  FETCH_FORM_DETAILS_START,
  FETCH_FORM_DETAILS_SUCCESS,
  FETCH_FORM_DETAILS_ERROR,
  CLEAR_ERROR
} from '../actions';

const INITIAL_STATE = {
  error: '',
  availableForms: null,
  selectedFormId: null,
  submittingForm: false,
  userForms: [],
  userForm: null
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AVAILABLE_FORMS_START:
      return { ...state, error: '', availableForms: null };
    case FETCH_AVAILABLE_FORMS_SUCCESS:
      return { ...state, error: '', availableForms: action.payload, selectedFormId: action.payload[0]._id };
    case FETCH_AVAILABLE_FORMS_ERROR:
      return { ...state, error: action.payload, availableForms: null };
    case FETCH_USER_FORMS_START:
      return { ...state, error: '', userForms: null };
    case FETCH_USER_FORMS_SUCCESS:
      return { ...state, error: '', userForms: action.payload };
    case FETCH_USER_FORMS_ERROR:
      return { ...state, error: action.payload, userForms: null };
    case HANDLE_FORM_SELECT:
      return { ...state, selectedFormId: action.payload };
    case SUBMIT_FORM_START:
      return { ...state, submittingForm: true, error: '' };
    case SUBMIT_FORM_SUCCESS:
      return { ...state, submittingForm: false, error: '' };
    case SUBMIT_FORM_ERROR:
      return { ...state, error: action.payload, submittingForm: false };
    case FETCH_FORM_DETAILS_START:
      return { ...state, userForm: null, error: '' };
    case FETCH_FORM_DETAILS_SUCCESS:
      return { ...state, userForm: action.payload, error: '' };
    case FETCH_FORM_DETAILS_ERROR:
      return { ...state, error: action.payload, userForm: null };
    case CLEAR_ERROR:
      return { ...state, error: '' }
    default:
      return state;
  }
}