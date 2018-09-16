import * as promisify from 'util.promisify'
import { onceLoaded } from '../fs/configure';
import * as fs from 'fs'
import * as mobx from 'mobx'
import { IApplicationSession, ApplicationSession } from './ApplicationSession'



async function getOrCreateAppSession(): Promise<IApplicationSession> {
  let filename = '/session/application.json'

  const fileExists = await exists(filename)
  let app: IApplicationSession;
  if (fileExists) {
    const contents = await promisify(fs.readFile)(filename, {encoding: 'utf8'})
    app =  ApplicationSession(filename, JSON.parse(contents))
  } else {
    app = ApplicationSession(filename, {})
  }
  if (app.currentProject) {
    await mobx.when(() => !!app.currentProjectSession)
  }

  return app
}

function exists(path: string) {
   return new Promise<boolean>((res, rej) => fs.exists(path, res))
}

async function buildDirectoryStructure(): Promise<void> {
  const folderExists: Boolean = await exists('/session/projects')
  if (!folderExists) {
    await promisify(fs.mkdir)('/session/projects')
  }
}


export function loadApplicationSession(): Promise<IApplicationSession> {
  return onceLoaded()
  .then(() => buildDirectoryStructure())
  .then(() => getOrCreateAppSession())
}







