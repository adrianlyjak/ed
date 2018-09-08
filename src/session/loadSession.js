import filesystemwrapper from "../fs/filesystemwrapper";

export function loadSession() {
  console.log('loadSession')
  filesystemwrapper.onceLoaded.then(x => {
    console.log(x)
  })
}