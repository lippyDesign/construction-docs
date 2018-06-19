import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { fetchUser } from './redux/actions';

import Routes from './routes-react';

import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  renderMain = () => {
    if (this.props.authInProgress) return <div />;
    return <div className={this.props.classes.main}>
      <Routes />
    </div>;
  }

  render() {
    return <Router>
      <div className='app'>
        <Header />
        {this.renderMain()}
        <Footer />
      </div>
    </Router>;
  }
}

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 56,
    // minHeight: `calc(100% - ${48}px)`,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
      // minHeight: `calc(100% - ${56}px)`
    }
  }
});

const mapStateToProps = state => {
  return { authInProgress: state.auth.authInProgress };
};

export default connect(mapStateToProps, { fetchUser })(withStyles(styles)(App));
