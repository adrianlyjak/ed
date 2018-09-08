import * as promisify from 'util.promisify'
import { onceLoaded } from '../fs/configure';
import * as fs from 'fs'
import { IApplicationSession, ApplicationSession } from './ApplicationSession'



async function getOrCreateAppSession(): Promise<IApplicationSession> {
  let filename = '/session/application.json'
  const exists = await promisify(fs.exists)(filename)
  if (!exists) {
    const contents = await promisify(fs.read)(filename, {encoding: 'utf8'})
    return ApplicationSession(filename, JSON.parse(contents))
  } else {
    return ApplicationSession(filename, {})
  }
}

async function buildDirectoryStructure(): Promise<void> {
  const projectStat = await promisify(fs.stat)('/session/projects')
  if (!projectStat.isDirectory()) {
    await promisify(fs.mkdir)('/session/projects')
  }
}


export function loadApplicationSession(): Promise<IApplicationSession> {
  return onceLoaded()
  .then(() => buildDirectoryStructure())
  .then(() => getOrCreateAppSession())
}







