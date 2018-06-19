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
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Drawer from '../components/drawer/Drawer';
import GenericForm from '../components/formBuilder/GenericForm';

import { fetchAvailableForms, createNewProject, updateFormInitialValues } from '../redux/actions';

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
    marginTop: 10
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
    
  };

  async componentDidMount() {
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
    return availableForms.map(form => <div className={classes.chipWrapper} key={form.id}>
      <Chip
        avatar={<Avatar><FaceIcon /></Avatar>}
        label={form.title}
        onClick={this.handleChipClick}
      />
    </div>);
  }

  renderPeopleThatHaveBeenSelected = () => {
    const { classes, availableForms } = this.props;
    return availableForms.map(form => <div className={classes.chipWrapper} key={form.id}>
      <Chip
        avatar={<Avatar>MB</Avatar>}
        label={form.title}
        onClick={this.handleChipClick}
        onDelete={this.handleChipDelete}
        className={classes.selectedChip}
        classes={{
          root: classes.selectedChip,
          avatar: classes.selectedChipAvatar,
          clickable: classes.selectedChipAvatarClick
        }}
      />
    </div>);
  }

  handleChipClick = () => {

  }

  handleChipDelete = () => {

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
    this.props.createNewProject(projectData, this.props.history);
  }

  getDrawerMainContent = () => {
    return <Paper className={this.props.classes.mainPaper}>
      {this.renderResponsiblePeople()}
      {this.renderForm()}
    </Paper>;
  }

  render() {
    const { classes, loading, error, availableForms } = this.props;
    if (error) return <Typography variant="subheading">{error}</Typography>
    if (loading) return <div className={classes.progressWrapper}>
      <CircularProgress size={50} />
    </div>;
    if (!availableForms) return <div />
    return <Drawer
      drawerMainTitle={this.state.selectedProject.title}
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

const mapStateToProps = state => {
  return {
    error: state.projects.error,
    loading: state.projects.loading,
    availableForms: state.forms.availableForms
  };
};

export default connect(mapStateToProps, { fetchAvailableForms, createNewProject, updateFormInitialValues })(withStyles(styles, { withTheme: true })(ProjectNew));
