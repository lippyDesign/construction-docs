import axios from 'axios';

// fetchProjects all projects to which user has access to
export const FETCH_PROJECTS_START = 'fetch_projects_start';
export const FETCH_PROJECTS_SUCCESS = 'fetch_projects_success';
export const FETCH_PROJECTS_ERROR = 'fetch_projects_error';
export const fetchProjects = () => async dispatch => {
  dispatch({ type: FETCH_PROJECTS_START });
  try {
    const { data } = await axios.get('/api/projects');
    dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e);
    dispatch({ type: FETCH_PROJECTS_ERROR, payload: 'error fetching projects' });
  }
};

// create a new project
export const CREATE_NEW_PROJECT_START = 'create_new_project_start';
export const CREATE_NEW_PROJECT_SUCCESS = 'create_new_project_success';
export const CREATE_NEW_PROJECT_ERROR = 'create_new_project_error';
export const createNewProject = (projectData, history) => async dispatch => {
  dispatch({ type: CREATE_NEW_PROJECT_START });
  try {
    const { data } = await axios.post('/api/projects', projectData);
    dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: data });
    history.push('/projects');
  } catch (e) {
    console.log(e);
    dispatch({ type: FETCH_PROJECTS_ERROR, payload: 'error creating project' });
  }
};

// fetch details of a particular project
export const FETCH_PROJECT_DETAILS_START = 'fetch_project_start';
export const FETCH_PROJECT_DETAILS_SUCCESS = 'fetch_project_success';
export const FETCH_PROJECT_DETAILS_ERROR = 'fetch_project_error';
export const fetchProjectDetails = projectId => async dispatch => {
  dispatch({ type: FETCH_PROJECT_DETAILS_START });
  try {
    const { data } = await axios.get(`/api/projects/${projectId}`);
    dispatch({ type: FETCH_PROJECT_DETAILS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e);
    dispatch({ type: FETCH_PROJECT_DETAILS_ERROR, payload: 'error fetching project' });
  }
};

// update details of a particular project
export const UPDATE_PROJECT_DETAILS_START = 'update_project_start';
export const UPDATE_PROJECT_DETAILS_SUCCESS = 'update_project_success';
export const UPDATE_PROJECT_DETAILS_ERROR = 'update_project_error';
export const updateProjectDetails = (newProjectDetails, projectId, history) => async dispatch => {
  dispatch({ type: UPDATE_PROJECT_DETAILS_START });
  try {
    const { data } = await axios.put(`/api/projects/${projectId}`, newProjectDetails);
    history.push('/projects');
    dispatch({ type: UPDATE_PROJECT_DETAILS_SUCCESS, payload: data });
  } catch (e) {
    console.log(e);
    dispatch({ type: UPDATE_PROJECT_DETAILS_ERROR, payload: 'error updating project' });
  }
};