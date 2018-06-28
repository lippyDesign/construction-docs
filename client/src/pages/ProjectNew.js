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

import Drawer from '../components/drawer/Drawer';
import GenericForm from '../components/formBuilder/GenericForm';
import ProjectPeople from '../components/ProjectPeople';

import { fetchAvailableForms, createNewProject, updateFormInitialValues, fetchUsers } from '../redux/actions';

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

  selectPerson = (personId, firstName, lastName) => {
    this.setState({
      selectedForms: {...this.state.selectedForms, [this.state.formType._id]:{ ...this.state.formType, personId, firstName, lastName } }
    });
  }

  handleChipClick = (formType) => {
    this.setState({ formType })
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
    console.log(users)
    this.props.createNewProject(projectData, this.props.history);
  }

  getDrawerMainContent = () => {
    return <Paper className={this.props.classes.mainPaper}>
      <ProjectPeople
        selectedForms={this.state.selectedForms}
        formType={this.state.formType}
        availableForms={this.props.availableForms}
        users={this.props.users}
        handleChipClick={this.handleChipClick}
        handleChipDelete={this.handleChipDelete}
        selectPerson={this.selectPerson}
      />
      {this.renderForm()}
    </Paper>;
  }

  render() {
    console.log(this.state.selectedForms)
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
