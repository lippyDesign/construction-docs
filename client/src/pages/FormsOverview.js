import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Avatar from '@material-ui/core/Avatar';
// import Paper from '@material-ui/core/Paper';
// import FolderIcon from '@material-ui/icons/Folder';
// import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';

import FormsList from '../components/FormsList';

import { /*getFormsSidebarItems, selectFormsInSidebar,*/ fetchUserForms } from '../redux/actions';

import Drawer from '../components/drawer/Drawer';

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
  newFormButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 8
  },
  switchWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 0,
    paddingLeft: 24
  },
  additionalSwitchLabel: {
    paddingRight: 15
  },
  switchBase: {
    color: '#9F9F9F',
    '&$checked': {
      color: '#9F9F9F',
      '& + $bar': {
        backgroundColor: '#9F9F9F',
      },
    },
  },
  bar: { color: '#9F9F9F'},
  checked: { color: '#9F9F9F' },
  sectionPaper: {
    padding: 20
  },
  sectionTitle: {
    textAlign: 'center'
  },
  noFormsTextWrapper: {
    height: 480,
    [theme.breakpoints.up('md')]: {
      height: 900
    }
  }
});

class FormsOverview extends React.Component {

  state = { checkedByProject: true }

  componentDidMount() {
    this.props.fetchUserForms();
    // this.props.getFormsSidebarItems();
  }

  ///////// SIDEBAR ///////////////

  // handleOptionSelect = id => {
  //   this.props.selectFormsInSidebar(id);
  //   this.setState({ mobileOpen: false });
  // }

  // handleViewByChange = name => event => {
  //   this.setState({ [name]: event.target.checked });
  // }

  // renderSwitch = () => {
  //   const { classes } = this.props;
  //   return <div className={classes.switchWrapper}>
  //     <Typography variant="body1" noWrap className={classes.additionalSwitchLabel}>
  //       View By:
  //     </Typography>
  //     <Typography variant="body1" noWrap className={classes.additionalSwitchLabel}>
  //       Date
  //     </Typography>
  //     <FormGroup row>
  //       <FormControlLabel
  //         control={
  //           <Switch
  //             checked={this.state.checkedByProject}
  //             onChange={this.handleViewByChange('checkedByProject')}
  //             value="checkedByProject"
  //             classes={{
  //               switchBase: classes.switchBase,
  //               checked: classes.checked,
  //               bar: classes.bar,
  //             }}
  //           />
  //         }
  //         label="Project"
  //       />
  //     </FormGroup>
  //   </div>;
  //   // if (!this.props.date) return this.renderDates();
  //   // return this.renerForms();
  // }

  renderListOfSidebarOptions = () => {
    const { classes /*, formsSidebarItems, selectedForms*/ } = this.props;
    return <List>
      <div className={classes.newFormButtonWrapper}>
        <Button variant="raised" color="secondary" component={Link} to="/forms/new">
          submit new form
        </Button>
      </div>
      <Divider />
      {/* {this.renderSwitch()}
      <Divider /> */}
      {/* {formsSidebarItems.map(({ name }) => <ListItem 
      className={classes.menuListItem} 
      key={name}
      button
      onClick={() => this.handleOptionSelect(name)}
      >
        <ListItemText primary={name} classes={{ primary: name === selectedForms ? classes.selectedFormSidebarText : '' }}  />
      </ListItem>)} */}
    </List>
  }

  getDrawerSidebarContent = () => {
    const { classes } = this.props;
    return <div>
      <Toolbar className={classes.mainToolbarTwo}>
        <Typography variant="subheading" noWrap className={classes.mainToolbarTitleTwo}>
          Forms to View
        </Typography>
      </Toolbar>
      <Divider />
      {this.renderListOfSidebarOptions()}
    </div>;
  }

  ///////// DRAWER MAIN ///////////////

  getDrawerMainContent = () => {
    // if (this.props.date) return this.renderForms();
    // if (this.state.checkedByProject) {
    //   return this.renderProjects();
    // } else {
    //   return this.renderDates();
    // }
    return this.renderForms();
  }

  // renderDates = () => {
  //   const { classes } = this.props;
  //   return <Paper className={classes.sectionPaper}>
  //     <Typography variant="subheading" noWrap className={classes.sectionTitle}>
  //       Dates
  //     </Typography>
  //     <List>
  //       <ListItem button>
  //         <Avatar>
  //           <FolderIcon />
  //         </Avatar>
  //         <ListItemText primary="Jan 9, 2014" secondary="5 forms" />
  //       </ListItem>
  //       <ListItem button>
  //         <Avatar>
  //           <FolderIcon />
  //         </Avatar>
  //         <ListItemText primary="Jan 7, 2014" secondary="5 forms" />
  //       </ListItem>
  //       <ListItem button>
  //         <Avatar>
  //           <FolderIcon />
  //         </Avatar>
  //         <ListItemText primary="July 20, 2014" secondary="5 forms" />
  //       </ListItem>
  //     </List>
  //   </Paper>
  // }

  renderForms = () => {
    if (!this.props.userForms.length) return <div className={this.props.classes.noFormsTextWrapper}>
      <Typography variant="body1" noWrap>
        You did not submit any forms yet
      </Typography>
    </div>;
    return <FormsList history={this.props.history} />;
  }

  // renderForms = () => {
  //   return <Paper>
  //     <List>
  //       <ListItem button>
  //         <Avatar>
  //           <InsertDriveFileIcon />
  //         </Avatar>
  //         <ListItemText primary="Daily Planning (PTP)" secondary="Submitted by John Smith on Jan 9, 2014" />
  //       </ListItem>
  //       <ListItem button>
  //         <Avatar>
  //           <InsertDriveFileIcon />
  //         </Avatar>
  //         <ListItemText primary="Superintendent Daily Report (SDR)" secondary="Submitted by John Smith on Jan 9, 2014" />
  //       </ListItem>
  //       <ListItem button>
  //         <Avatar>
  //           <InsertDriveFileIcon />
  //         </Avatar>
  //         <ListItemText primary="Safety Inspections" secondary="Submitted by John Smith on Jan 9, 2014" />
  //       </ListItem>
  //     </List>
  //   </Paper>;
  // }

  render() {
    // const { classes } = this.props;
    // const { formsSidebarItems, selectedForms } = this.props;
    // if (!formsSidebarItems || !selectedForms) return <div />;
    if (!this.props.userForms) return <div/>;
    return <Drawer
      // drawerMainTitle={selectedForms}
      drawerMainTitle="My Forms"
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

// TODO: fix this page
const mapStateToProps = state => {
  // const { formsSidebarItems, selectedForms } = state.util;
  return { /*formsSidebarItems, selectedForms*/ userForms: state.forms.userForms };
};

export default connect(mapStateToProps, { /*getFormsSidebarItems, selectFormsInSidebar,*/ fetchUserForms })(withStyles(styles, { withTheme: true })(FormsOverview));