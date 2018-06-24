import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import SimpleDialog from '../components/SimpleDialog';

const styles = theme => ({
  chipWrapper: {
    marginTop: 10,
    marginBottom: 10
  },
  selectedChip: {
    backgroundColor: '#26A69A',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#009688'
    }
  },
  selectedChipAvatar: {
    backgroundColor: '#00897B',
    color: '#fff'
  },
  usersList: {
    height: 500,
    overflowY: 'scroll'
  }
});

class ProjectPeople extends React.Component {
  state = { dialogOpen: false };

  handleChipClick = (formType) => {
    this.setState({ dialogOpen: true });
    this.props.handleChipClick(formType);
  }

  renderExecutivesThatNeedToBeSelected = () => {
    const { classes, selectedForms } = this.props;
    if (selectedForms.adminForm) return;
    return <div>
      <Typography variant="subheading">Select project admin:</Typography>
      <div className={classes.chipWrapper}>
        <Chip
          avatar={<Avatar><FaceIcon /></Avatar>}
          label='Project Admin'
          onClick={() => this.handleChipClick({ _id: 'adminForm', title: 'Admin' })}
        />
      </div>
    </div>;
  }

  renderExecutivesThatHaveBeenSelected = () => {
    const { classes, selectedForms, handleChipDelete } = this.props;
    if (!selectedForms.adminForm) return;
    return <div>
    <Typography variant="subheading">Select project admin:</Typography>
      <div className={classes.chipWrapper}>
        <Chip
          avatar={<Avatar>{selectedForms.adminForm.firstName[0]} {selectedForms.adminForm.lastName[0]}</Avatar>}
          label='Project Admin'
          onClick={() => this.handleChipClick({ _id: 'adminForm', title: 'Admin' })}
          onDelete={() => handleChipDelete('adminForm')}
          className={classes.selectedChip}
          classes={{
            root: classes.selectedChip,
            avatar: classes.selectedChipAvatar
          }}
        />
      </div>
    </div>;
  }

  renderResponsiblePeople = () => {
    return <div>
      <Typography variant="subheading">Select responsible people:</Typography>
      {this.renderPeopleThatNeedToBeSelected()}
      {this.renderPeopleThatHaveBeenSelected()}
    </div>;
  }

  renderPeopleThatNeedToBeSelected = () => {
    const { classes, availableForms, selectedForms } = this.props;
    const filteredForms = availableForms.filter(form => !selectedForms[form._id])
    return filteredForms.map(form => <div className={classes.chipWrapper} key={form._id}>
      <Chip
        avatar={<Avatar><FaceIcon /></Avatar>}
        label={form.title}
        onClick={() => this.handleChipClick(form)}
      />
    </div>);
  }

  renderPeopleThatHaveBeenSelected = () => {
    const { classes, availableForms, selectedForms, handleChipDelete } = this.props;
    if (!selectedForms) return;
    const filteredForms = [];
    availableForms.forEach(form => {
      if (selectedForms[form._id]) {
        filteredForms.push({
          ...form,
          firstName: selectedForms[form._id].firstName,
          lastName: selectedForms[form._id].lastName,
          personId: selectedForms[form._id].personId
        });
      }
    });
    return filteredForms.map(form => <div className={classes.chipWrapper} key={form._id}>
      <Chip
        avatar={<Avatar>{form.firstName[0]} {form.lastName[0]}</Avatar>}
        label={form.title}
        onClick={() => this.handleChipClick(form)}
        onDelete={() => handleChipDelete(form._id)}
        className={classes.selectedChip}
        classes={{
          root: classes.selectedChip,
          avatar: classes.selectedChipAvatar
        }}
      />
    </div>);
  }

  renderSimpleDialog = () => {
    const { users, formType, classes } = this.props;
    if (!formType) return;
    const { title, shortName } = formType;
    return <div>
      <SimpleDialog
        open={this.state.dialogOpen}
        title={`${title} ${shortName ? `(${shortName})` : ''}`}
        body={
          <List className={classes.usersList}>
            {users.map(({ email, _id, firstName, lastName, company }) => <ListItem button onClick={() => this.selectPerson(_id, firstName, lastName)} key={_id}>
              <Avatar>
                <FaceIcon />
              </Avatar>
              <ListItemText primary={`${firstName} ${lastName}`} secondary={`${company}, ${email}`} />
            </ListItem>)}
          </List>}
        onClose={this.closeSimpleDialog}
      />
    </div>;
  }

  closeSimpleDialog = () => {
    this.setState({ dialogOpen: false });
  }

  selectPerson = (personId, firstName, lastName) => {
    this.props.selectPerson(personId, firstName, lastName);
    this.closeSimpleDialog();
  }

  render() {
    if (!this.props.availableForms || !this.props.selectedForms) return <div />;
    return <div>
      {this.renderExecutivesThatNeedToBeSelected()}
      {this.renderExecutivesThatHaveBeenSelected()}
      {this.renderResponsiblePeople()}
      {this.renderSimpleDialog()}
    </div>
  }
}

export default (withStyles(styles, { withTheme: true })(ProjectPeople));