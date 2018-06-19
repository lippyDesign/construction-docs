import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  wrapper: {
    flex: 1,
    border: '1px solid red'
  },
  sectionPaper: {
    padding: 20,
  },
  sectionPaperTwo: {
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center'
  }
});

class Stats extends React.Component {
  renderUpcoming = () => {
    const { classes } = this.props;
    return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Upcoming
      </Typography>
      list of forms that due soon and their due dates
    </Paper>
  }

  renderMyStats = () => {
    const { classes } = this.props;
    return <Paper className={classes.sectionPaperTwo}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Submitted By Me
      </Typography>
      some on time stats data and charts
    </Paper>
  }

  renderOthersStats = () => {
    const { classes } = this.props;
    return <Paper className={classes.sectionPaperTwo}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Submitted To Me
      </Typography>
      some on time stats data and charts
    </Paper>
  }

  render() {
    if (!this.props.user) return <div />;
    return <div className={this.props.classes.wrapper}>
      {this.renderMyStats()}
      {this.renderOthersStats()}
    </div>;
  }
}

const mapStateToProps = state => {
  return { user: state.auth.user };
}

export default connect(mapStateToProps, {})(withStyles(styles, { withTheme: true })(Stats));