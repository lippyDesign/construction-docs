import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateOnlyRoute from './PrivateOnlyRoute';
import PublicOnlyRoute from './PublicOnlyRoute';

import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import ProjectNew from '../pages/ProjectNew';
import ProjectShow from '../pages/ProjectShow';
import ProjectsOverview from '../pages/ProjectsOverview';
import FormShow from '../pages/FormShow';
import FormNew from '../pages/FormNew';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Logout from '../pages/Logout';
import FormsOverview from '../pages/FormsOverview';
import NotFound from '../pages/NotFound';

const Routes = () => <div className='appContent'>
  <Switch>
    <PrivateOnlyRoute exact path='/projects/new' component={ProjectNew} />
    <PrivateOnlyRoute exact path='/projects/:id' component={ProjectShow} />
    <PrivateOnlyRoute exact path='/projects' component={ProjectsOverview} />
    <PrivateOnlyRoute exact path='/forms/new' component={FormNew} />
    <PrivateOnlyRoute exact path='/forms/new/:projectId/:formTypeId/:formId' component={FormNew} />
    <PrivateOnlyRoute exact path="/forms" component={FormsOverview} />
    <PrivateOnlyRoute exact path="/forms/:id" component={FormShow} />
    <PrivateOnlyRoute exact path="/dashboard" component={Dashboard} />
    <PrivateOnlyRoute exact path="/logout" component={Logout} />
    <PublicOnlyRoute exact path="/" component={Landing} />
    <PublicOnlyRoute exact path="/login" component={Login} />
    <PublicOnlyRoute exact path="/signup" component={SignUp} />
    <Route component={NotFound} />
  </Switch>
</div>

export default Routes;
