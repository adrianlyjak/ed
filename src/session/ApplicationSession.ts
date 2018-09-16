import * as mobx from 'mobx'
import { flushJsonToDisk } from './fileUtil';
import { ProjectSession, IProjectSession, IProjectSessionTemplate, loadProjectSession, listProjects } from './ProjectSession';
import * as fs from 'fs'
import * as promisify from 'util.promisify'

export interface ApplicationSessionOptions {
  currentProject?: string
  recentProjects?: string[]
}

export interface IApplicationSession {
  currentProject?: string
  currentProjectSession?: IProjectSession
  recentProjects: string[]
  loadingProject: boolean

  /** loads project from disk and sets the current project to it */
  loadProject: (projectId: string) => Promise<IProjectSession>
  /**
     * Stops persistence of this object for garbage collection.
     * @returns {Promise.<void>}
     */
  deactivate: () => Promise<void>
  listProjects: () => Promise<IProjectSession[]>

  /** creates a project and sets the current project to it  */
  createProject: (template: IProjectSessionTemplate) => IProjectSession
}


export function ApplicationSession(
  filepath: string, options: ApplicationSessionOptions = {}
): IApplicationSession {

  
  const self: IApplicationSession & mobx.IObservableObject = mobx.observable({
    currentProject: options.currentProject,
    recentProjects: options.recentProjects || [],
    currentProjectSession: null,
    loadingProject: false,
    
    loadProject: (projectId: string) => {
      return loadProjectSession(self, projectId).then(x => {
        console.log('activating...', projectId)
        return x.activate().then(() => x)
      
      })
    },
  
    deactivate: (): Promise<void> => {
      return disposeFlusher()
    },
    listProjects: () => listProjects(self),
    
    createProject: (template: IProjectSessionTemplate): IProjectSession => {
      const name = template.name || `Project ${self.recentProjects.length}`
      const project = ProjectSession(self, {...template, name })
      self.recentProjects.push(project.id)
      project.activate()
      return project
    }
  }, {
    loadProject: mobx.action,
    deactivate: mobx.action,
    listProjects: mobx.action,
    createProject: mobx.action,
  });

  mobx.reaction(x => mobx.toJS(self), x => console.log('app changed',  x))

  console.log('app', mobx.toJS(self))
  if (self.currentProject) {
    self.loadProject(self.currentProject)
  }

  const disposeFlusher = flushJsonToDisk(filepath, () => ({
    currentProject: self.currentProject,
    recentProjects: mobx.toJS(self.recentProjects)
  }))
  return self
}