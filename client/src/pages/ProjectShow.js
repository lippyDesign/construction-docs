import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { fetchProjectDetails, updateProjectDetails, updateFormInitialValues } from '../redux/actions';

import GenericForm from '../components/formBuilder/GenericForm';

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
  async componentDidMount() {
    await this.props.fetchProjectDetails(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    const { project } = this.props;
    if (prevProps.project !== project && project) {
      this.props.updateFormInitialValues({
        'Project Title': project.title,
        'Project Start Date': project.startDate.substring(0, 10),
        'Project Address': project.address,
        'Project City': project.city,
        'Project State': project.state,
        'Project Zip Code': project.postalCode,
        'Project Notes': project.notes
      });
    }
  }

  onFormSubmit = formValues => {
    const projectData = {
      title: formValues['Project Title'],
      address: formValues['Project Address'],
      city: formValues['Project City'],
      state: formValues['Project State'],
      postalCode: formValues['Project Zip Code'],
      startDate: formValues['Project Start Date'],
      notes: formValues['Project Notes'],
      type: 'general',
      users: []
    };
    this.props.updateProjectDetails(projectData, this.props.match.params.id, this.props.history);
  }

  render() {
    const { classes, project, loading } = this.props;
    if (loading) return <div className={classes.progressWrapper}>
      <CircularProgress size={50} />
    </div>;
    if (!project) return <div />;
    return <Paper className={classes.sectionPaper}>
    <div className={classes.formWrapper}>
      <GenericForm
        form={project._id}
        onSubmit={this.onFormSubmit}
        fields={availableProjectTypes[0].infoToBeCollected}
        buttonTitle='update project info'
      />
    </div>
  </Paper>
  }
}

const mapStateToProps = state => {
  return { project: state.projects.project };
}

export default connect(mapStateToProps, { fetchProjectDetails, updateProjectDetails, updateFormInitialValues })(withStyles(styles, { withTheme: true })(ProjectShow));