import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';

const styles = theme => ({
  wrapper: {
    flex: 1,
    display: 'flex'
  },
  sectionPaper: {
    padding: '20px 2px',
    minHeight: 480,
    flex: 1
  },
  sectionTitle: {
    textAlign: 'center'
  }
});

class Projects extends React.Component {

  renderProjects = () => {
    const { classes, userProjects, history } = this.props;
    return <Paper  className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        My Projects
      </Typography>
      <List>
        {userProjects.map(project => {
          return <ListItem button key={project._id} onClick={() => history.push(`/projects/${project._id}`)}>
            <Avatar>
              <BusinessCenterIcon />
            </Avatar>
            <ListItemText primary={project.title} secondary={`${project.city}, ${project.state}`} />
          </ListItem>
        })}
      </List>
    </Paper>
  }

  render() {
    if (this.props.error) return <Typography variant="subheading">{this.props.error}</Typography>
    if (!this.props.user) return <div />;
    if (!this.props.userProjects.length) return <Paper className={this.props.classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={this.props.classes.sectionTitle}>
        You are not a part of any projects yet
      </Typography>
    </Paper>
    return <div className={this.props.classes.wrapper}>
      {this.renderProjects()}
    </div>;
  }
}

const mapStateToProps = state => {
  return { user: state.auth.user, userProjects: state.projects.userProjects, error: state.projects.error };
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Projects));