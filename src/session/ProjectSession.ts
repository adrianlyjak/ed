import * as mobx from 'mobx'
import * as uuidv4 from 'uuid/v4'
import { flushJsonToDisk, IFlushDisposer, flush } from './fileUtil';
import './ApplicationSession'
import { IApplicationSession } from './ApplicationSession';
import * as promisify from 'util.promisify'
import * as fs from 'fs'
import { IEditorState } from '../graph/EditorState';


export interface IProjectSessionTemplate {
  id?: string,
  name?: string,
  lastKnownFilePath?: string,
  createdMillis?: number,
  lastEditedMillis?: number,
}

export interface IProjectSession extends mobx.IObservableObject {
  id: string,
  name: string,
  lastKnownFilePath?: string,
  createdMillis: number,
  lastEditedMillis: number,
  /**
     * - Watches this project for changes and flushes them to disk.
     * - Registers project session with application
     * @returns {Promise<void>}
     */
  activate(): Promise<void>
  /**
     * stops flushing. Unregisters project from application
     * @returns {Promise.<void>}
     */
  deactivate(): Promise<void>

  loadViewState(): Promise<IEditorState>
}

function projectPath(id: string): string {
  return `/session/projects/${id}.json`
}

export function listProjects(appSession: IApplicationSession): Promise<IProjectSession[]> {
  return Promise.all(appSession.recentProjects.map(x => loadProjectSession(appSession, x).catch(ex => {
    console.error(`${x} doesn't exist?`, ex)
    return null
  }))).then(xs => xs.filter(x => !!x))
}

export function loadProjectSession(
  appSession: IApplicationSession, 
  projectId: string
): Promise<IProjectSession> {
  console.log('load project session ', projectId)
  promisify(fs.readdir)('/session/projects').then(x => console.log('dirs', x))
  return promisify(fs.readFile)(projectPath(projectId), {encoding: 'utf-8'}).then((file: string) => {
    console.log('loaded project file', file)
    return ProjectSession(appSession, JSON.parse(file))
  })
}

export function ProjectSession(appSession: IApplicationSession, {
  id = uuidv4(),
  name,
  lastKnownFilePath,
  createdMillis = new Date().valueOf(),
  lastEditedMillis = new Date().valueOf()
}: IProjectSessionTemplate): IProjectSession {

  let deactivate: IFlushDisposer | undefined;
  const self: IProjectSession = mobx.observable({
    id, 
    name, 
    lastKnownFilePath,
    createdMillis, 
    lastEditedMillis,

    activate: async (): Promise<void> => {
      appSession.loadingProject = true
      if (appSession.currentProject && appSession.currentProject !== self.id) {
        await mobx.when(() => !!appSession.currentProjectSession)
        await appSession.currentProjectSession.deactivate()
      }
      appSession.currentProject = self.id
      appSession.currentProjectSession = self
      appSession.loadingProject = false
      
      deactivate = flushJsonToDisk(projectPath(id), () => mobx.toJS(self))      
    },
    
    deactivate: (): Promise<void> => {
      let done = deactivate()
      appSession.currentProject = null
      appSession.currentProjectSession = null
      deactivate = undefined
      return done
    },

    loadViewState: () => {
      throw ""
    }
  }, {
    activate: mobx.action,
    deactivate: mobx.action
  })

  return self
}