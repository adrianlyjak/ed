import React, { Component } from 'react';
import {Editor} from '../editor/Editor';
import {Graph} from '../graph/Graph';
import {GraphNode} from '../graph/GraphNode'

class App extends Component {
  render() {
    return (
      <div>
        <Graph />
      </div>
    );
  }
}

export default App;
