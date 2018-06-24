import React from 'react';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { fetchFormDetails, updateFormDetails, updateFormInitialValues, fetchAvailableForms, handleFormSelect, fetchProjects, clearError } from '../redux/actions';

import GenericForm from '../components/formBuilder/GenericForm';
import FormImages from '../components/FormImages';
import SimpleDialog from '../components/SimpleDialog';

const styles = theme => ({
  sectionPaper: {
    margin: '16px 8px',
    padding: '8px 8px 100px 8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formWrapper: {
    maxWidth: 700,
    paddingTop: 10
  },
  progressWrapper: {
    height: 480,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      height: 900
    }
  },
  formControl: {
    width: '100%',
    marginTop: 15,
    marginBottom: 10
  },
  gry: {
    color: 'gray'
  }
});

class FormShow extends React.Component {
  state = { project: '' };

  async componentDidMount() {
    await this.props.fetchProjects();
    await this.props.fetchFormDetails(this.props.match.params.id);
    await this.props.fetchAvailableForms();
  }

  componentDidUpdate(prevProps) {
    const { userForm, selectedForm, handleFormSelect, updateFormInitialValues, initialProjId } = this.props;
    if (prevProps.userForm !== userForm && userForm) {
      handleFormSelect(userForm.type);
    }
    if (prevProps.initialProjId !== initialProjId ) {
      this.setState({ 'project': initialProjId });
    }
    if (prevProps.selectedForm !== selectedForm && selectedForm) {
      updateFormInitialValues({
        'Number of workers': userForm.numberOfWorkers,
        'Number of units of equipment': userForm.numberOfUnitsOfEquipment,
        'Notes': userForm.notes,
        'Date on the form': userForm.formDate.substring(0, 10)
      });
    }
  }

  onFormSubmit = formValues => {
    const formData = {
      numberOfWorkers: formValues['Number of workers'],
      numberOfUnitsOfEquipment: formValues['Number of units of equipment'],
      notes: formValues['Notes'],
      formDate: formValues['Date on the form'],
      projectId: this.state.project
    };
    const formImages = [];
    this.props.updateFormDetails(this.props.match.params.id, formImages, formData, this.props.history);
  }

  handleProjectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderProjectSelect = () => {
    const { classes, userProjects } = this.props;
    return <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="project-simple">Project that this form is for *</InputLabel>
        <Select
          value={this.state.project}
          onChange={this.handleProjectChange}
          inputProps={{
            name: 'project',
            id: 'project-simple',
          }}
        >
          {userProjects.map(({ _id, title }) => <MenuItem key={_id} value={_id}>{title}</MenuItem>)}
        </Select>
      </FormControl>
    </div>;
  }

  render() {
    const { classes, userForm, loading, selectedForm, error, userProjects } = this.props;
    if (loading) return <div className={classes.progressWrapper}>
      <CircularProgress size={50} />
    </div>;
    if (!userForm || !selectedForm || !userProjects) return <div />;
    return <Paper className={classes.sectionPaper}>
      <div>
        <FormImages imageUrls={userForm.imageUrls} />
      </div>
      <div className={classes.formWrapper}>
        <Typography variant="title">{`${selectedForm.title} ${selectedForm.shortName ? `(${selectedForm.shortName})` : ''}`}</Typography>
        <Typography className={classes.gry} variant="body1">Created on {moment(userForm.createdAt).format("dddd, MMM Do YYYY")}</Typography>
        {this.renderProjectSelect()}
        <GenericForm
          form={userForm._id}
          onSubmit={this.onFormSubmit}
          fields={selectedForm.infoToBeCollected}
          buttonTitle='update form info'
        />
      </div>
      <SimpleDialog
        open={error === 'please select a project that the form is for' ? true : false}
        title='Error'
        body={<Typography className={classes.dialogText} variant="subheading">{error}</Typography>}
        onClose={() => clearError()}
      />
    </Paper>
  }
}

const mapStateToProps = (state) => {
  const { availableForms, userForm, error } = state.forms;
  const selectedForm = userForm && availableForms ? availableForms.find(f => f._id === userForm.formTypeId) : null;
  const initialProj = userForm ? state.projects.userProjects.find(project => project._id === userForm.projectId) : null;
  const initialProjId = initialProj ? initialProj._id : null;
  return { userForm, selectedForm, error, userProjects: state.projects.userProjects, initialProjId };
}

export default connect(mapStateToProps, { fetchFormDetails, updateFormDetails, updateFormInitialValues, fetchAvailableForms, handleFormSelect, fetchProjects, clearError })(withStyles(styles, { withTheme: true })(FormShow));