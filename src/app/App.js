import React, { Component } from 'react';
import {Editor} from '../editor/Editor';
import {GraphView, createGraphViewState} from '../graph/GraphView';
import { loadSession } from '../session/loadSession';

const state = createGraphViewState()

class App extends Component {


  componentDidMount() {
    loadSession()
  }

  render() {
    return (
      <div>
        <GraphView state={state}/>
      </div>
    );
  }
}

export default App;
