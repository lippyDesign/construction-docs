import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// PublicOnlyRoute is only available if user is not logged in
const PublicOnlyRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return <Route
    {...rest}
    render={props => (
      isAuthenticated
      ? (
        <Redirect to={{ pathname: '/dashboard', state: { from: props.location} }} />
      )
      : (<Component {...props} />)
    )}
  />
}
  
const mapStateToProps = ({ auth: { user } }) => {
  return { isAuthenticated: user ? true : false };
}

export default connect(mapStateToProps)(PublicOnlyRoute);