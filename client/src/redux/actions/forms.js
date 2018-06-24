import axios from "axios";

export const FETCH_AVAILABLE_FORMS_START = 'fetch_available_forms_start';
export const FETCH_AVAILABLE_FORMS_SUCCESS = 'fetch_available_forms_success';
export const FETCH_AVAILABLE_FORMS_ERROR = 'fetch_available_forms_error';
export const fetchAvailableForms = () => async dispatch => {
  dispatch({ type: FETCH_AVAILABLE_FORMS_START });
  try {
    // const data = [
    //   {
    //     id: 'p-t-p',
    //     title: 'Daily Planning',
    //     shortName: 'PTP',
    //     infoToBeCollected: [
    //       { title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },
    //       { title: 'Number of workers', mustBeFilledOut: true, inputType: 'text' },
    //       { title: 'Number of units of equipment', mustBeFilledOut: true, inputType: 'text' },
    //       { title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }
    //     ]
    //   },
    //   { id: 's-d-r', title: 'Superintendent Daily Report', shortName: 'SDR', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Number of workers', mustBeFilledOut: true, inputType:'text' }, { title: 'Number of units of equipment', mustBeFilledOut: true, inputType: 'text' }, { title: 'Notes', mustBeFilledOut: false, inputType: 'text', multiline: true }]},
    //   { id: 'safety-inspection', title: 'Safety Inspection', shortName: '', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }]},
    //   { id: 'tools-and-equipment-inspection', title: 'Tools and Equipment Inspection', shortName: '', infoToBeCollected: [{ title: 'Date on the form', mustBeFilledOut: true, inputType: 'date' },{ title: 'Notes', mustBeFilledOut: false, inputType:'text', multiline: true }]},
    // ]
    const { data } = await axios.get('/api/formtypes');
    dispatch({ type: FETCH_AVAILABLE_FORMS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e)
    dispatch({ type: FETCH_AVAILABLE_FORMS_ERROR, payload: 'There was a problem fetching available forms' });
  }
}

export const HANDLE_FORM_SELECT = 'handle_form_select';
export const handleFormSelect = id => ({ type: HANDLE_FORM_SELECT, payload: id });

export const CLEAR_ERROR = 'clear_error';
export const clearError = id => ({ type: CLEAR_ERROR });

export const SUBMIT_FORM_START = 'submit_form_start';
export const SUBMIT_FORM_ERROR = 'submit_form_error';
export const SUBMIT_FORM_SUCCESS = 'submit_form_success';
export const submitForm = (images, formData, history) => async dispatch => {
  if (!images.length) return dispatch({ type: SUBMIT_FORM_ERROR, payload: 'please add a picture of the form you are submitting' });
  if (!formData.projectId) return dispatch({ type: SUBMIT_FORM_ERROR, payload: 'please select a project that the form is for' });
  dispatch({ type: SUBMIT_FORM_START });
  try {
    // obtain signed urls
    const signedUrls = await Promise.all(images.map(({ file }) => {
      return axios.post('/api/upload', {
        projectId: formData.projectId,
        type: formData.type,
        formDate: formData.formDate,
        fileType: file.type.split('/')[1]
      });
    }));

    // upload to google storage using the signed urls
    await Promise.all(signedUrls.map((signedUrl, index) => {
      return axios.put(signedUrl.data, images[index].file, {
        headers: {
          'Content-Type': images[index].file.type
        }
      });
    }));

    // attach image urls to form
    const imageUrls = signedUrls.map(url => url.data.split('?')[0]);
    formData.imageUrls = imageUrls;

    // submit form to the db of forms
    const data = await axios.post('/api/forms', formData);
    dispatch({ type: SUBMIT_FORM_SUCCESS, payload: data });
    history.push('/forms');
  } catch (e) {
    console.log(e)
    console.log(e.message)
    dispatch({ type: SUBMIT_FORM_ERROR, payload: 'unable to submit form' });
  }
}

export const FETCH_USER_FORMS_START = 'fetch_user_forms_start';
export const FETCH_USER_FORMS_SUCCESS = 'fetch_user_forms_success';
export const FETCH_USER_FORMS_ERROR = 'fetch_user_forms_error';
export const fetchUserForms = () => async dispatch => {
  dispatch({ type: FETCH_USER_FORMS_START });
  try {
    const { data } = await axios.get('/api/forms');
    dispatch({ type: FETCH_USER_FORMS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e)
    dispatch({ type: FETCH_USER_FORMS_ERROR, payload: 'There was a problem fetching user forms' });
  }
}

export const FETCH_FORM_DETAILS_START = 'fetch_form_details_start';
export const FETCH_FORM_DETAILS_SUCCESS = 'fetch_form_details_success';
export const FETCH_FORM_DETAILS_ERROR = 'fetch_form_details_error';
export const fetchFormDetails = formId => async dispatch => {
  dispatch({ type: FETCH_FORM_DETAILS_START });
  try {
    const { data } = await axios.get(`/api/forms/${formId}`);
    dispatch({ type: FETCH_FORM_DETAILS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e)
    dispatch({ type: FETCH_FORM_DETAILS_ERROR, payload: 'There was a problem fetching user form' });
  }
}

export const UPDATE_FORM_DETAILS_START = 'update_form_details_start';
export const UPDATE_FORM_DETAILS_SUCCESS = 'update_form_details_success';
export const UPDATE_FORM_DETAILS_ERROR = 'update_form_details_error';
export const updateFormDetails = (formId, formImages, formData, history) => async dispatch => {
  if (!formData.projectId) return dispatch({ type: UPDATE_FORM_DETAILS_ERROR, payload: 'please select a project that the form is for' });
  dispatch({ type: FETCH_FORM_DETAILS_START });
  try {
    formData.imageUrls = formImages;
    const { data } = await axios.put(`/api/forms/${formId}`, formData);
    dispatch({ type: FETCH_FORM_DETAILS_SUCCESS, payload: data });
    history.push('/forms');
  } catch (e) {
    console.log(e)
    dispatch({ type: FETCH_FORM_DETAILS_ERROR, payload: 'There was a problem updating user form' });
  }
}