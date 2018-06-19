import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  wrapper: {
    flex: 1,
    display: 'flex'
  },
  sectionPaper: {
    padding: 20,
    minHeight: 480,
    flex: 1
  },
  sectionPaperTwo: {
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center'
  }
});

class Upcoming extends React.Component {
  renderUpcoming = () => {
    const { classes } = this.props;
    return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Upcoming
      </Typography>
      List of forms that due soon and their due dates (NOT READY YET)
    </Paper>
  }

  render() {
    if (!this.props.user) return <div />;
    return <div className={this.props.classes.wrapper}>
      {this.renderUpcoming()}
    </div>;
  }
}

const mapStateToProps = state => {
  return { user: state.auth.user };
}

export default connect(mapStateToProps, {})(withStyles(styles, { withTheme: true })(Upcoming));