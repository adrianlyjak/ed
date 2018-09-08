import * as mobx from 'mobx'
import * as uuidv4 from 'uuid/v4'
import { flushJsonToDisk, IFlushDisposer } from './fileUtil';
import './ApplicationSession'
import { IApplicationSession } from './ApplicationSession';


export interface IProjectSessionTemplate {
  id?: string,
  name: string,
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
  activate(): void
  deactivate(): Promise<void>
}

export function ProjectSession(appSession: IApplicationSession, {
  id = uuidv4(),
  name,
  lastKnownFilePath,
  createdMillis = new Date().valueOf(),
  lastEditedMillis = new Date().valueOf()
}: IProjectSessionTemplate): IProjectSession {

  let deactivate: IFlushDisposer | undefined;
  const self = mobx.observable({
    id, 
    name, 
    lastKnownFilePath,
    createdMillis, 
    lastEditedMillis,
    /**
     * watches this project for changes and flushes them to disk
     * @returns {void}
     */
    activate: (): void => {
      // appSession.ac
      deactivate = flushJsonToDisk(`/sessions/projects/${id}.json`, self as any as mobx.IObservable)
    },
    /**
     * stops flushing
     * @returns {Promise.<void>}
     */
    deactivate: (): Promise<void> => {
      let done = deactivate()
      deactivate = undefined
      return done
    }
  }, {
    activate: mobx.action
  })

  return self
}