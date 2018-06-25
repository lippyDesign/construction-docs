import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import Drawer from '../components/drawer/Drawer';
import GenericForm from '../components/formBuilder/GenericForm';
import SimpleDialog from '../components/SimpleDialog';

import { fetchAvailableForms, handleFormSelect, submitForm, updateFormInitialValues, fetchProjects, clearError } from '../redux/actions';

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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      height: 900
    }
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
  formControl: {
    width: '100%',
    marginTop: 15,
    marginBottom: 10
  },
  dialogText: {
    padding: 20
  }
});

class FormNew extends React.Component {
  state = { images: [], project: '' };

  async componentDidMount() {
    await this.props.fetchProjects();
    await this.props.fetchAvailableForms();
    this.props.updateFormInitialValues({ 'Date on the form': moment().format("YYYY-MM-DD") });
    if (this.props.match.params.formId) {
      this.handleFormSelect(this.props.match.params.formId);
    }
    if (this.props.match.params.projectId) {
      this.setState({ project: this.props.match.params.projectId });
    }
  }

  ///////// SIDEBAR ///////////////

  handleFormSelect = id => {
    this.props.handleFormSelect(id);
    this.setState({ mobileOpen: false });
  }

  renderListOfForms = () => {
    const { classes, selectedForm } = this.props;
    return <List>
      {this.props.availableForms.map(({ title, _id }) => <ListItem 
      className={classes.menuListItem} 
      key={_id}
      button
      onClick={() => this.handleFormSelect(_id)}
      >
        <ListItemText primary={title} classes={{ primary: _id === selectedForm._id ? classes.selectedFormSidebarText : '' }}  />
      </ListItem>)}
    </List>
  }

  getDrawerSidebarContent = () => {
    const { classes } = this.props;
    return <div>
      <Toolbar className={classes.mainToolbarTwo}>
        <Typography variant="subheading" noWrap className={classes.mainToolbarTitleTwo}>
          Select Form
        </Typography>
      </Toolbar>
      <Divider />
      {this.renderListOfForms()}
    </div>;
  }

  ///////// DRAWER MAIN ///////////////

  renderForm = () => {
    return <GenericForm
      form={this.props.selectedForm._id}
      key={this.props.selectedForm._id}
      onSubmit={this.onFormSubmit}
      fields={this.props.selectedForm.infoToBeCollected}
    />;
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

  renderImages = () => {
    const { classes, selectedForm } = this.props;
    const imagesForCurrentForm = this.state.images.filter(image => image.formId === selectedForm._id);
    return imagesForCurrentForm.map(image => <div key={image.id} className={classes.selectImageButton} style={{ backgroundImage: `url("${image.imagePreviewUrl}")` }}>
      <Typography variant="title" noWrap className={classes.removeImageText} onClick={() => this.removeImage(image.id)}>
        REMOVE
      </Typography>
    </div>);
  }

  removeImage = id => {
    const newArray = this.state.images.filter(img => img.id !== id);
    this.setState({ images: newArray });
  }

  renderSelectImagesSection = () => {
    const { classes } = this.props;
    return <div className={classes.selectImagesSection}>
      {this.renderImages()}
      {this.renderSelectImageButton()}
    </div>;
  }

  renderSelectImageButton = () => {
    const { classes } = this.props;
    return <div className={classes.selectImageButton}>
      <label className={classes.fileUploadLabel}>
        <input type="file" onChange={ e => this.handleImageChange(e)} />
      </label>
      <Typography variant="title" noWrap className={classes.selectImageText}>
        SELECT
      </Typography>
    </div>
  }

  handleImageChange = event => {
    event.preventDefault();
    // if user cancelled select
    if (!event.target.files.length) return;
    let reader = new FileReader();
    let file = event.target.files[0];
    const id = `img-${this.state.images.length}`;
    reader.onloadend = () => {
      this.setState({
        images: [...this.state.images, { file, imagePreviewUrl: reader.result, id, formId: this.props.selectedForm._id }]
      });
    }
    reader.readAsDataURL(file)
  }

  onFormSubmit = formValues => {
    const { selectedForm } = this.props;
    const formData = {
      type: `${selectedForm.title} ${selectedForm.shortName ? `(${selectedForm.shortName})` : ''}`,
      formDate: formValues['Date on the form'],
      numberOfWorkers: formValues['Number of workers'],
      numberOfUnitsOfEquipment: formValues['Number of units of equipment'],
      notes: formValues['Notes'],
      formTypeId: selectedForm._id,
      projectId: this.state.project
    }
    this.props.submitForm(this.state.images, formData, this.props.history);
  }

  getDrawerMainContent = () => {
    const { classes, error, clearError } = this.props;
    return <Paper className={classes.mainPaper}>
      {this.renderSelectImagesSection()}
      {this.renderProjectSelect()}
      {this.renderForm()}
      <SimpleDialog
        open={error === 'please add a picture of the form you are submitting' || error === 'please select a project that the form is for' ? true : false}
        title='Error'
        body={<Typography className={classes.dialogText} variant="subheading">{error}</Typography>}
        onClose={() => clearError()}
      />
    </Paper>;
  }

  render() {
    const { classes, availableForms, selectedForm, submitting, projectsLoading, userProjects } = this.props;
    if (!availableForms || !selectedForm || projectsLoading) return <div />;
    if (!userProjects.length) return <div className={classes.progressWrapper}>
      <Typography variant="subheading" noWrap>You are not a part of any projects. You must be part of a project to be able to submit a form</Typography>
    </div>;
    if (submitting) return <div className={classes.progressWrapper}>
      <Typography variant="subheading" noWrap>Submitting form, this may take a moment</Typography>
      <CircularProgress size={50} />
    </div>;
    return <Drawer
      drawerMainTitle={`${selectedForm.title} ${selectedForm.shortName ? `(${selectedForm.shortName})` : ''}`}
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

const mapStateToProps = (state) => {
  const { availableForms, selectedFormId, submittingForm, error } = state.forms;
  let selectedForm = null;
  if (availableForms && selectedFormId) {
    selectedForm = availableForms.find(form => form._id === state.forms.selectedFormId);
  }
  return {
    error,
    availableForms,
    selectedForm,
    submitting: submittingForm,
    form: state.form,
    userProjects: state.projects.userProjects,
    projectsLoading: state.projects.loading
  };
};

export default connect(mapStateToProps, { fetchAvailableForms, handleFormSelect, submitForm, updateFormInitialValues, fetchProjects, clearError })(withStyles(styles, { withTheme: true })(FormNew));
