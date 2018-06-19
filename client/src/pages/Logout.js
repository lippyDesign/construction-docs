import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { logout } from '../redux/actions';

class Logout extends React.Component {
  componentDidMount() {
    this.props.logout(this.props.history);
  }

  render() {
    return <div className={this.props.classes.wrapper}>
      <CircularProgress size={50} />
    </div>
  }
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default connect(null, { logout })(withStyles(styles)(Logout));
