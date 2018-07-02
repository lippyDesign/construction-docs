import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import Drawer from '../components/drawer/Drawer';
import Projects from '../components/Projects';

import { fetchProjects } from '../redux/actions';

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
  sectionPaper: {
    padding: 20,
    minHeight: 480,
    flex: 1,
    [theme.breakpoints.up('md')]: {
      minHeight: 900
    }
  }
});

const sidebarOptions = [
  { name: 'My Projects' }
];

class ProjectsOverview extends React.Component {
  state = { selectedSidebarOption: '' };

  async componentDidMount() {
    await this.props.fetchProjects();
    this.setState({ selectedSidebarOption: sidebarOptions[0].name });
  }

  ///////// DRAWER MAIN ///////////////

  getDrawerTitle = () => {
    return this.state.selectedSidebarOption;
  }

  getDrawerMainContent = () => {
    switch (this.state.selectedSidebarOption) {
      case 'My Projects':
        return <Projects history={this.props.history} />;
      default:
        return <div />;
    }
  }

  ///////// DRAWER SIDEBAR ///////////////

  getDrawerSidebarContent = () => {
    const { classes } = this.props;
    return <div>
      <Toolbar className={classes.mainToolbarTwo}>
        <Typography variant="subheading" noWrap className={classes.mainToolbarTitleTwo}>
          Info
        </Typography>
      </Toolbar>
      <Divider />
      {this.renderListOfSidebarOptions()}
    </div>;
  }

  renderListOfSidebarOptions = () => {
    const { classes } = this.props;
    return <List>
      <div className={classes.newFormButtonWrapper}>
        <Button variant="raised" color="secondary" component={Link} to="/projects/new">
          new project
        </Button>
      </div>
      <Divider />
      {sidebarOptions.map(({ name }) => <ListItem 
      className={classes.menuListItem} 
      key={name}
      button
      onClick={() => this.handleOptionSelect(name)}
      >
        <ListItemText
          primary={name}
          classes={{ primary: name === this.state.selectedSidebarOption ? classes.selectedFormSidebarText : '' }}
        />
      </ListItem>)}
    </List>
  }

  handleOptionSelect = name => {
    this.setState({ selectedSidebarOption: name });
  }

  ///////// RENDER ///////////////

  render() {
    if (!sidebarOptions || !this.state.selectedSidebarOption || this.props.loading) {
      return <div className={this.props.classes.sectionPaper} />
    }
    return <Drawer
      drawerMainTitle={this.getDrawerTitle()}
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

const mapStateToProps = state => {
  return { loading: state.projects.loading };
};

export default connect(mapStateToProps, { fetchProjects })(withStyles(styles, { withTheme: true })(ProjectsOverview));