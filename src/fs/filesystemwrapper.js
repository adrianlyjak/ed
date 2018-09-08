// import { FileSystem } from 'browserfs/dist/node/core/file_system';
import promisify from 'util.promisify'

const isBrowser = new Function(`
try {
  return this === window;
} catch(e) { 
  return false;
}
`);
let fs;
let onceLoaded
if (isBrowser()) {
  const BrowserFS = require('browserfs')
  const container = {}
  BrowserFS.install(container)
  onceLoaded = promisify(BrowserFS.configure({fs: "IndexedDB"})).then(x => {
    fs = container.require('fs')
    return fs
  })
} else {
  throw new Error('No filesystem implemented yet')
}

export default {
  /** @returns {FileSystem|undefined} */
  get fs() {
    return fs
  },
  /** @returns {Promise<FileSystem>} */
  get onceLoaded() {
    return onceLoaded
  }
}