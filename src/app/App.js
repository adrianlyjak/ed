import React, { Component } from 'react';
import {Editor} from '../editor/Editor';
import {GraphView} from '../graph/GraphView';


class App extends Component {
  render() {
    return (
      <div>
        <GraphView />
      </div>
    );
  }
}

export default App;
