import * as React from 'react'
import { IApplicationSession } from '../session/ApplicationSession';
import {
  WithTheme,
  List, ListItem, ListItemText,
  ListItemIcon,
  Drawer,
  Icon, Button, Divider, Input, InputLabel, TextField, ListSubheader, IconButton
} from '@material-ui/core';
import {
  ChevronRight, 
  ChevronLeft,
  Folder
} from '@material-ui/icons'
import { ProjectsDialog } from './ProjectsDialog';
import { observer } from 'mobx-react';
import { IProjectSession } from '../session/ProjectSession';

@observer
export class MainMenu extends React.Component<
{
  appSession?: IApplicationSession
  forceOpen?: boolean
},
{
  open: boolean,
  modal: any
},
{}> {

  state = {
    open: false,
    modal: null
  }

  setModalComponent(modal: any) {
    this.setState({ modal })
  }

  openProjects = () => {
    this.setModalComponent(<ProjectsDialog appSession={this.props.appSession} />)
  }

  // openSnaphsots = () => {

  // }

  // openDownloads = () => {

  // }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }


  render() {
    return <div style={{ position: 'fixed' }}>
      {
        this.props.appSession && <IconButton onClick={this.toggle}>
          
          <Folder />
        </IconButton>
      }
      {
        <Drawer
          variant="persistent"
          open={this.state.open || this.props.forceOpen}
        // onClose={this.handleDrawerToggle}
        // classes={{
        //   paper: classes.drawerPaper,
        // }}
        // ModalProps={{
        //   keepMounted: true, // Better open performance on mobile.
        // }}
        >
          <div style={{ width: '300px' }} >
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '10px'}}>
              <IconButton onClick={this.toggle}>
                <ChevronLeft />
              </IconButton>
            </div>
            <Divider />
            <List component="nav">
              <ListItem onClick={this.openProjects} button>
                <ListItemIcon><Icon style={{ fontSize: 24 }}>perm_media</Icon></ListItemIcon>
                <ListItemText>Projects</ListItemText>
              </ListItem>
            </List>
            <Divider />
            {
              !!this.props.appSession && !!this.props.appSession.currentProjectSession &&
              <ProjectSessionMenu projectSession={this.props.appSession.currentProjectSession} />
            }
          </div>
        </Drawer>
      }
      {
        this.state.modal && React.cloneElement(this.state.modal, {
          open: true,
          onClose: () => this.setState({ modal: null })
        })
      }

    </div>
  }
}

@observer
export class ProjectSessionMenu extends React.Component<{ projectSession: IProjectSession }> {
  render() {
    const { projectSession } = this.props
    return <List
      subheader={<ListSubheader>Current Project</ListSubheader>}
    >
      <ListItem>
        <TextField
          label="Name"
          placeholder="Project Name"
          value={projectSession.name}
          onChange={e => { projectSession.name = e.target.value }} />
      </ListItem>
    </List>
  }
}