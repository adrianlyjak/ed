import * as promisify from 'util.promisify'
// import { FileSystem } from 'browserfs/dist/node/core/file_system';
let BrowserFS = require('browserfs')

BrowserFS = BrowserFS as any


const isBrowser: () => boolean = new Function(`
try {
  return this === window;
} catch(e) { 
  return false;
}
`) as () => boolean;

BrowserFS.install(window)

const configure: (any) => Promise<void> = promisify(BrowserFS.configure)

const loaded: Promise<void> = configure({ 
    fs: 'MountableFileSystem',
    options: {
      '/session': {
        fs: 'IndexedDB',
        options: {
          storeName: 'session',
        },
      },
      '/projects': {
        fs: 'IndexedDB',
        options: {
          storeName: 'projects',
        },
      }
    }
  }).then(x => {
    window['fs'] = require('fs')
  })

export function onceLoaded(): Promise<void> {
  return loaded
}