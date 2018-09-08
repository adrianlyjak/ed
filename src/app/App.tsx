import * as React from 'react';
import {GraphView as Untyped} from '../graph/GraphView';
import * as sess from '../session/loadSession';
import { IApplicationSession } from '../session/ApplicationSession';

const GraphView = Untyped as any as typeof React.Component
interface IAppState {
  loaded: boolean,
  failedToLoad: boolean,
  appSession?: IApplicationSession
}

export default class App extends React.Component<{}, IAppState, {}> {

  state: IAppState = {
    loaded: false,
    failedToLoad: false,
    appSession: null
  }

  componentDidMount() {
    console.log({sess})
    const loadApplicationSession = sess.loadApplicationSession
    console.log({ loadApplicationSession })
    const ld = loadApplicationSession()
    console.log(ld)
    ld.then(sess => {
      this.setState({ loaded: true })
    }).catch(e => {
      console.error(e)
      this.setState({ failedToLoad: true})
    })
  }

  render() {
    
    return (
      <div>
        <GraphView />
      </div>
    );
  }
}