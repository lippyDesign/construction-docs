import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Drawer from '../components/drawer/Drawer';
import GenericForm from '../components/formBuilder/GenericForm';
import SimpleDialog from '../components/SimpleDialog';

import { fetchAvailableForms, createNewProject, updateFormInitialValues, fetchUsers } from '../redux/actions';

import fileUploadImage from '../images/fileUpload.png';

const styles = theme => ({
  mainToolbarTwo: {
    backgroundColor: '#E0E0E0',
    borderBottom: '1px solid lightgray'
  },
  mainToolbarTitleTwo: {
    textAlign: 'center',
    width: '100%',
    color: 'black'
  },
  menuListItem: {
    borderBottom: '1px solid lightgray'
  },
  selectedFormSidebarText: {
    color: '#1565C0',
    fontWeight: 500
  },
  mainPaper: {
    padding: theme.spacing.unit * 2,
    flex: 1
  },
  progressWrapper: {
    height: 480,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectImagesSection: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  selectImageButton: {
    width: 120,
    height: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundImage: `url("${fileUploadImage}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    margin: 5
  },
  selectImageText : {
    color: '#fff',
    letterSpacing: 1.2,
    marginBottom: 10
  },
  fileUploadLabel: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer'
  },
  removeImageText: {
    color: '#fff',
    letterSpacing: 1.2,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    textAlign: 'center'
  },
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

const availableProjectTypes = [
  {
    id: 'project-type-1',
    title: 'General Project',
    infoToBeCollected: [
      { title: 'Project Title', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Project Start Date', mustBeFilledOut: true, inputType: 'date' },
      { title: 'Project Address', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Project City', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Project State', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Project Zip Code', mustBeFilledOut: true, inputType: 'text' },
      { title: 'Project Notes', mustBeFilledOut: false, inputType:'text', multiline: true }
    ]
  }
];

class ProjectNew extends React.Component {
  state = {
    selectedProject: availableProjectTypes[0],
    dialogOpen: false,
    formType: null,
    selectedForms: {}
  };

  async componentDidMount() {
    await this.props.fetchUsers();
    await this.props.fetchAvailableForms();
    this.props.updateFormInitialValues({ 'Project Start Date': moment().format("YYYY-MM-DD") });
  }

  ///////// SIDEBAR ///////////////

  handleProjectSelect = id => {
    const selectedProject = availableProjectTypes.find(p => p.id === id);
    this.setState({ mobileOpen: false, selectedProject });
  }

  renderListOfProjects = () => {
    const { classes } = this.props;
    const { selectedProject } = this.state;
    return <List>
      {availableProjectTypes.map(({ title, id }) => <ListItem 
      className={classes.menuListItem} 
      key={id}
      button
      onClick={() => this.handleProjectSelect(id)}
      >
        <ListItemText primary={title} classes={{ primary: id === selectedProject.id ? classes.selectedFormSidebarText : '' }}  />
      </ListItem>)}
    </List>
  }

  getDrawerSidebarContent = () => {
    const { classes } = this.props;
    return <div>
      <Toolbar className={classes.mainToolbarTwo}>
        <Typography variant="subheading" noWrap className={classes.mainToolbarTitleTwo}>
          Select Project
        </Typography>
      </Toolbar>
      <Divider />
      {this.renderListOfProjects()}
    </div>;
  }

  ///////// DRAWER MAIN ///////////////

  renderExecutivesThatNeedToBeSelected = () => {
    if (this.state.selectedForms.adminForm) return;
    const { classes } = this.props;
    return <div className={classes.responsiblePeople}>
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
    if (!this.state.selectedForms.adminForm) return;
    const { classes } = this.props;
    return <div className={classes.responsiblePeople}>
    <Typography variant="subheading">Select project admin:</Typography>
      <div className={classes.chipWrapper}>
        <Chip
          avatar={<Avatar>{this.state.selectedForms.adminForm.firstName[0]} {this.state.selectedForms.adminForm.lastName[0]}</Avatar>}
          label='Project Admin'
          onClick={() => this.handleChipClick({ _id: 'adminForm', title: 'Admin' })}
          onDelete={() => this.handleChipDelete('adminForm')}
          className={classes.selectedChip}
          classes={{
            root: classes.selectedChip,
            avatar: classes.selectedChipAvatar,
            clickable: classes.selectedChipAvatarClick
          }}
        />
      </div>
    </div>;
  }

  renderResponsiblePeople = () => {
    const { classes } = this.props;
    return <div className={classes.responsiblePeople}>
      <Typography variant="subheading">Select responsible people:</Typography>
      {this.renderPeopleThatNeedToBeSelected()}
      {this.renderPeopleThatHaveBeenSelected()}
    </div>;
  }

  renderPeopleThatNeedToBeSelected = () => {
    const { classes, availableForms } = this.props;
    const filteredForms = availableForms.filter(form => !this.state.selectedForms[form._id])
    return filteredForms.map(form => <div className={classes.chipWrapper} key={form._id}>
      <Chip
        avatar={<Avatar><FaceIcon /></Avatar>}
        label={form.title}
        onClick={() => this.handleChipClick(form)}
      />
    </div>);
  }

  renderPeopleThatHaveBeenSelected = () => {
    if (!this.state.selectedForms) return;
    const { classes, availableForms } = this.props;
    const filteredForms = [];
    availableForms.forEach(form => {
      if (this.state.selectedForms[form._id]) {
        filteredForms.push({
          ...form,
          firstName: this.state.selectedForms[form._id].firstName,
          lastName: this.state.selectedForms[form._id].lastName,
          personId: this.state.selectedForms[form._id].personId
        });
      }
    });
    return filteredForms.map(form => <div className={classes.chipWrapper} key={form._id}>
      <Chip
        avatar={<Avatar>{form.firstName[0]} {form.lastName[0]}</Avatar>}
        label={form.title}
        onClick={this.handleChipClick}
        onDelete={() => this.handleChipDelete(form._id)}
        className={classes.selectedChip}
        classes={{
          root: classes.selectedChip,
          avatar: classes.selectedChipAvatar,
          clickable: classes.selectedChipAvatarClick
        }}
      />
    </div>);
  }

  renderSimpleDialog = () => {
    if (!this.state.formType) return;
    const { users, classes } = this.props;
    const { title, shortName } = this.state.formType;
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
    this.setState({ dialogOpen: false, dialogTitle: '' });
  }

  selectPerson = (personId, firstName, lastName) => {
    this.setState({
      selectedForms: {...this.state.selectedForms, [this.state.formType._id]:{ ...this.state.formType, personId, firstName, lastName } }
    });
    this.closeSimpleDialog();
  }

  handleChipClick = (formType) => {
    this.setState({ dialogOpen: true, formType })
  }

  handleChipDelete = formId => {
    const { selectedForms } = this.state;
    const { [formId]: omit, ...otherForms } = selectedForms;
    this.setState({ selectedForms: otherForms });
  }

  renderForm = () => {
    const { id, infoToBeCollected } = this.state.selectedProject;
    return <GenericForm
      form={id}
      key={id}
      onSubmit={this.onFormSubmit}
      fields={infoToBeCollected}
    />;
  }

  onFormSubmit = formValues => {
    // get the users and the forms they are responsible for
    const users = [];
    for (const selectedForm in this.state.selectedForms) {
      if (!this.state.selectedForms.hasOwnProperty(selectedForm)) continue;
      if (selectedForm === "adminForm") continue;
      users.push({ formTypeId: selectedForm, userId: this.state.selectedForms[selectedForm].personId })
    }

    const projectData = {
      title: formValues['Project Title'],
      address: formValues['Project Address'],
      city: formValues['Project City'],
      state: formValues['Project State'],
      postalCode: formValues['Project Zip Code'],
      startDate: formValues['Project Start Date'],
      notes: formValues['Project Notes'],
      type: 'general',
      ownerId: this.state.selectedForms.adminForm ? this.state.selectedForms.adminForm.personId : null,
      users
    };
    console.log(projectData)
    this.props.createNewProject(projectData, this.props.history);
  }

  getDrawerMainContent = () => {
    return <Paper className={this.props.classes.mainPaper}>
      {this.renderExecutivesThatNeedToBeSelected()}
      {this.renderExecutivesThatHaveBeenSelected()}
      {this.renderResponsiblePeople()}
      {this.renderForm()}
      {this.renderSimpleDialog()}
    </Paper>;
  }

  render() {
    const { classes, projectLoading, error, availableForms, usersLoading } = this.props;
    if (error) return <Typography variant="subheading">{error}</Typography>
    if (projectLoading || usersLoading) return <div className={classes.progressWrapper}>
      <CircularProgress size={50} />
    </div>;
    if (!availableForms) return <div />
    return <Drawer
      drawerMainTitle={`Create ${this.state.selectedProject.title}`}
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

const mapStateToProps = state => {
  return {
    error: state.projects.error,
    projectLoading: state.projects.loading,
    usersLoading: state.users.loading,
    users: state.users.users,
    availableForms: state.forms.availableForms
  };
};

export default connect(mapStateToProps, { fetchAvailableForms, createNewProject, updateFormInitialValues, fetchUsers })(withStyles(styles, { withTheme: true })(ProjectNew));
