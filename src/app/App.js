import React, { Component } from 'react';
import {Editor} from '../editor/Editor';
import {GraphView, createGraphViewState} from '../graph/GraphView';

const state = createGraphViewState()

class App extends Component {
  render() {
    return (
      <div>
        <GraphView state={state}/>
      </div>
    );
  }
}

export default App;
