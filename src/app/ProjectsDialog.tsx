import { 
  Avatar, 
  List, ListItem, ListItemText, ListItemAvatar, Dialog, DialogTitle
 } from '@material-ui/core';
import {Add} from '@material-ui/icons'
import * as React from 'react';
import { IApplicationSession } from '../session/ApplicationSession';
import { IProjectSession } from '../session/ProjectSession';

export interface ProjectsDialogProps {
  open?: boolean, 
  onClose?: () => {},
  appSession: IApplicationSession
}

interface ProjectsDialogState {
  isLoading: boolean,
  sessions: IProjectSession[]
}

export class ProjectsDialog extends React.Component<ProjectsDialogProps, ProjectsDialogState> {

  state: ProjectsDialogState = {
    isLoading: true,
    sessions: []
  }
  
  componentDidMount() {
    this.props.appSession.listProjects().then(xs => {
      this.setState({
        isLoading: false,
        sessions: xs
      })
    })
  }

  addProject = () => {
    this.props.appSession.createProject({ name: ''})
    this.props.onClose()
  }

  render() {
    
    return <Dialog 
      open={this.props.open || false} 
      onClose={this.props.onClose || (() => {})} >
        <DialogTitle>Projects</DialogTitle>
        <div>
          <List>
            {
              this.state.sessions.map(project => {
                return <ListItem 
                  button
                  key={project.id}
                  onClick={() => {
                    console.log('activate!')
                    project.activate().then(() => this.props.onClose())
                  }}>
                  {project.name || project.id}
                </ListItem>
              })
            }
            <ListItem button onClick={this.addProject}>
              <ListItemAvatar>
                <Avatar>
                  <Add />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="New Project" />
            </ListItem>
          </List>
        </div>
      </Dialog>
  }
}
