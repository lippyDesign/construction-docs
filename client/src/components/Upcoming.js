import React from 'react';
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
  async componentDidMount() {
    await this.props.fetchUpcomingForms();
  }

  renderUpcoming = () => {
    const { classes, upcomingForms, history } = this.props;
    return <Paper className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        Upcoming
      </Typography>
      <List>
        {upcomingForms.map(form => <ListItem button key={`${form._id}-${form.projectId}`} onClick={() => history.push(`/forms/new/${form.projectId}/${form._id}`)}>
          <Avatar>
            <SubjectIcon />
          </Avatar>
          <ListItemText primary={form.title} secondary={`Due on 2018-06-25, ${form.projectTitle}`} />
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