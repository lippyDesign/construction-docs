import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MoreVirtIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';

const drawerWidth = 280;

const styles = theme => ({
  root: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    marginLeft: -9,
    marginRight: -9,
    paddingBottom: 8
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    backgroundColor: '#E0E0E0'
  },
  mainToolbar: {
    position: 'relative'
  },
  mainToolbarTitle: {
    textAlign: 'right',
    width: '100%',
    color: 'black',
    fontSize: 14,
    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
      fontSize: 21
    },
  },
  mainToolbarIcon: {
    position: 'absolute',
    left: 0,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow: '1px 1px 1px 0px lightgray',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    paddingTop: theme.spacing.unit * 1.5,
    marginTop: 56,
    [theme.breakpoints.up('md')]: {
      marginTop: 64
    }
  },
  closeIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
    zIndex: 2500,
    color: 'gray'
  }
});

class AppDrawer extends React.Component {
  state = { mobileOpen: false };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, drawerMainTitle, drawerMainContent, drawerSidebarContent } = this.props;
    return <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.mainToolbar}>
          <IconButton
            aria-label="open drawer"
            onClick={this.handleDrawerToggle}
            className={classes.mainToolbarIcon}
          >
            <MoreVirtIcon />
          </IconButton>
          <Typography variant="title" noWrap className={classes.mainToolbarTitle}>
            {drawerMainTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={this.state.mobileOpen}
          onClose={this.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.handleDrawerToggle}
            onKeyDown={this.handleDrawerToggle}
          >
            <CloseIcon className={classes.closeIcon} />
            {drawerSidebarContent}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawerSidebarContent}
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        {drawerMainContent}
      </main>
    </div>
  }
}

export default withStyles(styles, { withTheme: true })(AppDrawer);