// js root
import './bootstrap'
import * as serviceWorker from './serviceWorker';
import * as TouchEmulator from 'hammer-touchemulator'
TouchEmulator()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
console.log('hello from js')
serviceWorker.unregister();