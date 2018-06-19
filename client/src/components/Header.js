import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { getNavbarItems } from '../redux/actions';

const drawerWidth = 280;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1201
  },
  navBar: {
    backgroundColor: '#212121',
    zIndex: 1201
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mobileMenu: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  mobileMenuList: {
    width: drawerWidth
  },
  mobileMenuListItemText: {
    textAlign: 'center'
  },
  desktopMenu: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block'
    }
  },
  mainToolbarTwo: {
    backgroundColor: '#E0E0E0',
    borderBottom: '1px solid lightgray'
  },
  mainToolbarTitleTwo: {
    textAlign: 'center',
    width: '100%',
    color: 'black'
  }
});

class Header extends React.Component {
  state = { right: false }

  componentDidMount() {
    this.props.getNavbarItems(this.props.isAuthenticated);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.props.getNavbarItems(this.props.isAuthenticated);
    }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  renderNavButtons() {
    if (this.props.authInProgress) return <div />;
    return [this.renderMobileMenu(), this.renderDesktopMenu()]
  }

  renderMobileMenu = () => {
    const { classes, navbarItems, history } = this.props;
    return <div className={classes.mobileMenu} key='mobileMenu'>
      <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer('right', true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        open={this.state.right}
        onClose={this.toggleDrawer('right', false)}
        onOpen={this.toggleDrawer('right', true)}
      >
        <Toolbar className={classes.mainToolbarTwo}>
          <Typography variant="subheading" noWrap className={classes.mainToolbarTitleTwo}>
            Navigate To
          </Typography>
        </Toolbar>
        <Divider />
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleDrawer('right', false)}
          onKeyDown={this.toggleDrawer('right', false)}
        >
          <List className={classes.mobileMenuList}>
            {navbarItems.map(({ name, url }) => <ListItem button key={name} onClick={() => history.push(url)}>
              <ListItemText primary={name} className={classes.mobileMenuListItemText} />
            </ListItem>)}
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  }

  renderDesktopMenu = () => {
    const { classes, navbarItems, history } = this.props;
    return <div className={classes.desktopMenu} key='desktopMenu'>
      {navbarItems.map(({ name, url }) => <Button key={name} onClick={() => history.push(url)} color="inherit">{name}</Button>)}
    </div>;
  }

  render() {
    const { classes } = this.props;
    return <div className={classes.root}>
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.toolBar}>
          <Typography variant="title" color="inherit">
            Logo
          </Typography>
          {this.renderNavButtons()}
        </Toolbar>
      </AppBar>
    </div>;
  }
}

const mapStateToProps = ({ util, auth }) => ({
  navbarItems: util.navbarItems,
  authInProgress: auth.authInProgress,
  isAuthenticated: auth.user ? true : false
});

export default connect(mapStateToProps, { getNavbarItems })(withRouter(withStyles(styles, { withTheme: true })(Header)));
