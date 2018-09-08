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

const loaded: Promise<void> = new Promise((res, rej) => {
  BrowserFS.configure({ 
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
  }, (e: any | undefined) => {
    e ? rej(e) : res()
  })
})

export function onceLoaded(): Promise<void> {
  return loaded
}