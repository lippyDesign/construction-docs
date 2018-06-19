export const GET_NAVBAR_ITEMS = 'get_navbar_items';
export const getNavbarItems = isAuthenticated => {
  const itemsAvailableAlways = [];
  const itemsAvailableOnlyWhenLoggedIn = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Projects', url: '/projects' },
    { name: 'Forms', url: '/forms' },
    { name: 'Logout', url: '/logout' }
  ]
  const itemsAvailableOnlyWhenLoggedOut = [
    { name: 'Home', url: '/' },
    { name: 'Sign In', url: '/login' },
    { name: 'Sign Up', url: '/signup' }
  ];
  const payload = isAuthenticated ? [...itemsAvailableAlways, ...itemsAvailableOnlyWhenLoggedIn] : [...itemsAvailableAlways, ...itemsAvailableOnlyWhenLoggedOut];
  return { type: GET_NAVBAR_ITEMS, payload };
};

export const GET_FORMS_SIDEBAR_ITEMS = 'get_forms_sidebar_items';
export const getFormsSidebarItems = isAuthenticated => {
  const sidebarItems = [
    { name: 'Forms Submitted By Me' },
    { name: 'Forms Submitted To Me' },
    { name: 'Forms I Need To Review' }
  ];
  return { type: GET_FORMS_SIDEBAR_ITEMS, payload: sidebarItems };
};

export const SELECT_FORMS_IN_SIDEBAR = 'selected_forms_in_sidebar';
export const selectFormsInSidebar = newForms => {
  return { type: SELECT_FORMS_IN_SIDEBAR, payload: newForms };
};

export const UPDATE_FORM_INITIAL_VALUES = 'update_form_initial_values';
export const updateFormInitialValues = newInitialValues => {
  return { type: UPDATE_FORM_INITIAL_VALUES, payload: newInitialValues };
};