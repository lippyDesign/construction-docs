import {
  GET_NAVBAR_ITEMS,
  GET_FORMS_SIDEBAR_ITEMS,
  SELECT_FORMS_IN_SIDEBAR,
  UPDATE_FORM_INITIAL_VALUES
} from '../actions';

const INITIAL_STATE = {
  navbarItems: [],
  formsSidebarItems: [],
  selectedForms: '',
  formInitialValues: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_NAVBAR_ITEMS:
      return { ...state, navbarItems: action.payload };
    case GET_FORMS_SIDEBAR_ITEMS:
      return { ...state, formsSidebarItems: action.payload, selectedForms: action.payload[0].name };
    case SELECT_FORMS_IN_SIDEBAR:
      return { ...state, selectedForms: action.payload };
    case UPDATE_FORM_INITIAL_VALUES:
      return { ...state, formInitialValues: action.payload };
    default:
      return state;
  }
}