import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Drawer from '../components/drawer/Drawer';
import Account from '../components/Account';
import Stats from '../components/Stats';
import Upcoming from '../components/Upcoming';

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
  }
});

const sidebarOptions = [
  { name: 'Upcoming' },
  // { name: 'Stats' },
  { name: 'Account' }
];

class Dashboard extends React.Component {
  state = { selectedSidebarOption: '' };

  componentDidMount() {
    this.setState({ selectedSidebarOption: sidebarOptions[0].name });
  }

  ///////// DRAWER MAIN ///////////////

  getDrawerTitle = () => {
    return this.state.selectedSidebarOption;
  }

  getDrawerMainContent = () => {
    switch (this.state.selectedSidebarOption) {
      case 'Upcoming':
        return <Upcoming />;
      case 'Stats':
        return <Stats />;
      case 'Account':
        return <Account />;
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
    if (!sidebarOptions || !this.state.selectedSidebarOption) return <div />;
    return <Drawer
      drawerMainTitle={this.getDrawerTitle()}
      drawerMainContent={this.getDrawerMainContent()}
      drawerSidebarContent={this.getDrawerSidebarContent()}
    />
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Dashboard));