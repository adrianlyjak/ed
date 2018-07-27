import {observable} from 'mobx';

export class GraphNode {
  x = observable.value(undefined);
  // @observable y = undefined;
  // @observable parents = undefined;
  // @observable children = undefined;
}
console.log({ observable })
new GraphNode()