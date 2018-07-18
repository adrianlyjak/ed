import * as CodeMirror from 'react-codemirror'
import * as React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import sheet from './editorStyles'

import Paper from '@material-ui/core/Paper'

import '../codemirror/theme/variable.css'
import 'codemirror/theme/solarized.css'
import { createMuiTheme } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import blue from '@material-ui/core/colors/blue';
import {text} from './sample'
import createTheme from '../codemirror/theme/material-ui'
import injectSheet from 'react-jss'


const mui = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Merriweather"', 'serif'
    ].join(', '),
  },
  palette: {
    type: 'light',
    primary: cyan,
    secondary: blue,
  },
  status: {
    danger: 'orange',
  },
})
const theme = createTheme(mui)
console.log('foo is', theme.classes.foo)




export const Editor = injectSheet(sheet)(class UnstyledEditor extends React.Component{

  constructor(props) {
    super(props)
    console.log({props: this.props})
    const value = window.localStorage.getItem('content') || text
    this.state = {
      value: value,
      options: {
        lineWrapping: true,
        mode: {
          name: 'gfm',
          highlightFormatting: true,
        },
        theme: 'material-ui'
      }
    }


  }


  render() {
    const classes = this.props.classes
    return <div className={classes.editorContainer}>


      <CodeMirror
        className={`${classes.editor} ${theme.classes.materialUI}`}
        options={this.state.options}
        value={this.state.value}
        onChange={this.onValueChanged} />


    </div>
  }

  onThemeChanged = (event) => {
    this.setState({ options: { ...this.state.options, theme: event.target.value } })
  }

  onValueChanged = (value) => {
    window.localStorage.setItem('content', value)
    this.setState({ value })
  }

})