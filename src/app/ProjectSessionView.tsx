
import * as React from 'react'
import { IProjectSession } from '../session/ProjectSession';
import { GraphView, createGraphViewState } from '../graph/GraphView';


export class ProjectSessionView extends React.Component<{
  projectSession: IProjectSession
}> {
  
  viewState = createGraphViewState()

  render() {
    return <GraphView state={this.viewState} />
  }

}