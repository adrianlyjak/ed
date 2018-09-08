import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';

console.log('hello from tsx')
const TypedApp = App as any as typeof React.Component;
ReactDOM.render(<TypedApp />, document.getElementById('root'));
