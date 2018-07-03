import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import SubjectIcon from '@material-ui/icons/Subject';

import { fetchUpcomingForms } from '../redux/actions';

const styles = theme => ({
  wrapper: {
    flex: 1,
    display: 'flex'
  },
  sectionPaper: {
    padding: 20,
    minHeight: 480,
    flex: 1,
    ['@media (min-width:375px)']: { // eslint-disable-line no-useless-computed-key
      height: 550
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 795
    }
  },
  sectionTitle: {
    textAlign: 'center'
  }
});

class Upcoming extends React.Component {
  async componentDidMount() {
    await this.props.fetchUpcomingForms();
  }

  renderUpcoming = () => {
    const { classes, upcomingForms, history } = this.props;
    if (!upcomingForms.length) return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        You are up to date on all of your forms
      </Typography>
    </Paper>
    return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Upcoming
      </Typography>
      <List>
        {upcomingForms.map(form => <ListItem button key={form._id} onClick={() => history.push(`/forms/new/${form.projectId._id}/${form.formTypeId._id}/${form._id}`)}>
          <Avatar>
            <SubjectIcon />
          </Avatar>
          <ListItemText primary={form.formTypeId.title} secondary={`Due on ${moment(form.dueOn).format('MMM Do, YYYY')} - ${form.projectId.title}`} />
        </ListItem>)}
      </List>
    </Paper>
  }

  render() {
    if (this.props.upcomingFormsLoading) return <div />;
    if (this.props.upcomingFormsError) return <div>
      <Typography variant="subheading" noWrap className={this.props.classes.sectionTitle}>
        {this.props.upcomingFormsError}
      </Typography>
    </div>;
    return <div className={this.props.classes.wrapper}>
      {this.renderUpcoming()}
    </div>;
  }
}

const mapStateToProps = state => {
  return {
    upcomingForms: state.forms.upcomingForms,
    upcomingFormsLoading: state.forms.loading,
    upcomingFormsError: state.forms.error
  };
}

export default connect(mapStateToProps, { fetchUpcomingForms })(withStyles(styles, { withTheme: true })(Upcoming));