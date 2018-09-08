import * as mobx from 'mobx'
import { flushJsonToDisk } from './fileUtil';
import { ProjectSession, IProjectSession, IProjectSessionTemplate } from './ProjectSession';

export interface ApplicationSessionOptions {
  currentProject?: string
  recentProjects?: string[]
}

export interface IApplicationSession {
  currentProject?: string
  recentProjects: string[]
  deactivate: () => Promise<void>
  // createProject: (IProjectSessionTemplate) => IProjectSession
}


export function ApplicationSession(
  filepath: string, options: ApplicationSessionOptions = {}
): IApplicationSession {

  
  const self = mobx.observable({
    currentProject: options.currentProject,
    recentProjects: options.recentProjects || [],
    /**
     * Stops persistence of this object for garbage collection.
     * @returns {Promise.<void>}
     */
    deactivate: (): Promise<void> => {
      return disposeFlusher()
    },
    // createProject: (template: IProjectSessionTemplate): IProjectSession => {
    //   return ProjectSession(self, template)
    // }
  })

  const disposeFlusher = flushJsonToDisk(filepath, self as any as mobx.IObservable)
  return self
}