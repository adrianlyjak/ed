import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';

console.log('hello from tsx')
const el = document.createElement('div')
document.body.appendChild(el)
ReactDOM.render(<App />, el);
