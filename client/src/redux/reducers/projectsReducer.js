import {
  FETCH_PROJECTS_START,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_ERROR,
  CREATE_NEW_PROJECT_START,
  CREATE_NEW_PROJECT_SUCCESS,
  CREATE_NEW_PROJECT_ERROR,
  FETCH_PROJECT_DETAILS_START,
  FETCH_PROJECT_DETAILS_SUCCESS,
  FETCH_PROJECT_DETAILS_ERROR,
  UPDATE_PROJECT_DETAILS_START,
  UPDATE_PROJECT_DETAILS_SUCCESS,
  UPDATE_PROJECT_DETAILS_ERROR
} from '../actions';

const INITIAL_STATE = {
  error: '',
  userProjects: [],
  loading: false,
  project: null
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECTS_START:
      return { ...state, error: '', userProjects: [], loading: true };
    case FETCH_PROJECTS_SUCCESS:
      return { ...state, error: '', userProjects: action.payload, loading: false };
    case FETCH_PROJECTS_ERROR:
      return { ...state, error: action.payload, userProjects: [], loading: false };
    case FETCH_PROJECT_DETAILS_START:
      return { ...state, error: '', loading: true, project: null };
    case FETCH_PROJECT_DETAILS_SUCCESS:
      return { ...state, error: '', project: action.payload, loading: false };
    case FETCH_PROJECT_DETAILS_ERROR:
      return { ...state, error: action.payload, project: null, loading: false };
    case UPDATE_PROJECT_DETAILS_START:
      return { ...state, error: '', loading: true, project: null };
    case UPDATE_PROJECT_DETAILS_SUCCESS:
      return { ...state, error: '', project: action.payload, loading: false };
    case UPDATE_PROJECT_DETAILS_ERROR:
      return { ...state, error: action.payload, project: null, loading: false };
    case CREATE_NEW_PROJECT_START:
      return { ...state, error: '', userProjects: [], loading: true };
    case CREATE_NEW_PROJECT_SUCCESS:
      return { ...state, error: '', userProjects: action.payload, loading: false };
    case CREATE_NEW_PROJECT_ERROR:
      return { ...state, error: action.payload, userProjects: [], loading: false };
    default:
      return state;
  }
}