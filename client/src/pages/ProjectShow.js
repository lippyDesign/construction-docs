import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { fetchProjectDetails, updateProjectDetails, updateFormInitialValues, fetchUsers, fetchAvailableForms } from '../redux/actions';

import GenericForm from '../components/formBuilder/GenericForm';
import ProjectPeople from '../components/ProjectPeople';

const styles = theme => ({
  sectionPaper: {
    margin: '16px 8px',
    padding: '8px 8px 100px 8px',
    display: 'flex',
    justifyContent: 'center'
  },
  formWrapper: {
    maxWidth: 700
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

class ProjectShow extends React.Component {
  state = {
    formType: null,
    selectedForms: {}
  };

  async componentDidMount() {
    await this.props.fetchUsers();
    await this.props.fetchAvailableForms();
    await this.props.fetchProjectDetails(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    const { project, updateFormInitialValues } = this.props;
    if (prevProps.project !== project && project) {
      updateFormInitialValues({
        'Project Title': project.title,
        'Project Start Date': project.startDate.substring(0, 10),
        'Project Address': project.address,
        'Project City': project.city,
        'Project State': project.state,
        'Project Zip Code': project.postalCode,
        'Project Notes': project.notes
      });

      const selectedForms = project.projectUsers.reduce((prev, curr) => {
        const newObjSubmit = curr.formTypesMustSubmit.reduce((prev2, curr2) => {
          return { ...prev2, [curr2._id]: { firstName: curr.userId.firstName, lastName: curr.userId.lastName, personId: curr.userId._id, title: curr2.title, _id: curr2._id } };
        }, {});
        return { ...prev, ...newObjSubmit };
      }, {});
      const owner = project.projectUsers.find(({ roles }) => roles[0] === 'owner');
      selectedForms.adminForm = { firstName: owner.userId.firstName, lastName: owner.userId.lastName, personId: owner.userId._id, title: 'Admin', _id: 'adminForm' };
      this.setState({ selectedForms });
    }
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
    this.props.updateProjectDetails(projectData, this.props.match.params.id, this.props.history);
  }

  handleChipClick = (formType) => {
    const admin = this.props.project.projectUsers.find(({ roles }) => roles[0] === 'owner');
    if (admin) {
      if (admin.userId._id !== this.props.user._id) return;
    }
    this.setState({ formType })
  }

  handleChipDelete = formId => {
    const admin = this.props.project.projectUsers.find(({ roles }) => roles[0] === 'owner');
    if (admin) {
      if (admin.userId._id !== this.props.user._id) return;
    }
    const { selectedForms } = this.state;
    const { [formId]: omit, ...otherForms } = selectedForms;
    this.setState({ selectedForms: otherForms });
  }

  selectPerson = (personId, firstName, lastName) => {
    this.setState({
      selectedForms: {...this.state.selectedForms, [this.state.formType._id]:{ ...this.state.formType, personId, firstName, lastName } }
    });
  }

  render() {
    const { classes, project, loading, user } = this.props;
    if (loading) return <div className={classes.progressWrapper}>
      <CircularProgress size={50} />
    </div>;
    if (!project) return <div />;

    let doNotRenderButton = false;
    let disabled = false;
    const admin = project.projectUsers.find(({ roles }) => roles[0] === 'owner');
    if (admin) {
      if (admin.userId._id !== user._id) {
        doNotRenderButton = true;
        disabled = true;
      }
    }

    return <Paper className={classes.sectionPaper}>
    <div className={classes.formWrapper}>
      <ProjectPeople
        selectedForms={this.state.selectedForms}
        formType={this.state.formType}
        availableForms={this.props.availableForms}
        users={this.props.users}
        handleChipClick={this.handleChipClick}
        handleChipDelete={this.handleChipDelete}
        selectPerson={this.selectPerson}
      />
      <GenericForm
        form={project._id}
        onSubmit={this.onFormSubmit}
        fields={availableProjectTypes[0].infoToBeCollected}
        buttonTitle='update project info'
        doNotRenderButton={doNotRenderButton}
        disabled={disabled}
      />
    </div>
  </Paper>
  }
}

const mapStateToProps = state => {
  return {
    project: state.projects.project,
    users: state.users.users,
    availableForms: state.forms.availableForms,
    user: state.auth.user
  };
}

export default connect(mapStateToProps, { fetchProjectDetails, updateProjectDetails, updateFormInitialValues, fetchUsers, fetchAvailableForms })(withStyles(styles, { withTheme: true })(ProjectShow));