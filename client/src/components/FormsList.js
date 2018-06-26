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

class FormsList extends React.Component {

  renderForms = () => {
    const { classes, userForms, history } = this.props;
    return <Paper  className={classes.sectionPaper}>
      <Typography variant="subheading" noWrap className={classes.sectionTitle}>
        My Forms
      </Typography>
      <List>
        {userForms.map(form => <ListItem button key={form._id} onClick={() => history.push(`/forms/${form._id}`)}>
          <Avatar>
            <SubjectIcon />
          </Avatar>
          <ListItemText
            primary={`${form.formTypeId.title} ${form.formTypeId.shortName ? `(form.formTypeId.shortName)` : ''}`}
            secondary={`${form.submittedOn.substring(0, 10)}, ${form.projectId.title}`}
          />
        </ListItem>)}
      </List>
    </Paper>
  }

  render() {
    console.log(this.props.userForms)
    if (this.props.error) return <Typography variant="subheading">{this.props.error}</Typography>
    return <div className={this.props.classes.wrapper}>
      {this.renderForms()}
    </div>;
  }
}

const mapStateToProps = state => {
  return { userForms: state.forms.userForms };
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsList));