import * as CodeMirror from 'codemirror'
import * as React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import sheet from './editorStyles'
import * as html2canvas from 'html2canvas'
import Paper from '@material-ui/core/Paper'

import '../codemirror/theme/variable.css'
import 'codemirror/theme/solarized.css'
import { createMuiTheme, WithTheme, WithStyles, withStyles } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import blue from '@material-ui/core/colors/blue';
import { text } from './sample'
import createTheme from '../codemirror/theme/material-ui'
import injectSheet from 'react-jss'
import { theme } from '../app/theme'
import { Modal } from '@material-ui/core';

const sheetA = sheet
export const Editor = withStyles(sheet)(class UnstyledEditor extends React.Component<{
  value: string,
  size?: string,
  onChange: (value: string) => {},
  style?: any
} & WithStyles<typeof sheetA>> {

  state = {
    modal: undefined,
    options: {
      lineWrapping: true,
      mode: {
        name: 'gfm',
        highlightFormatting: true,
      },
      theme: 'material-ui'
    }
  }

  container: HTMLDivElement
  setContainer = (container: HTMLDivElement) => this.container = container

  componentDidMount() {
    var cm = CodeMirror((el: HTMLElement) => {
      this.container.appendChild(el);
      setTimeout(() => {
        
        html2canvas(el).then(canvas => {
          this.container.removeChild(el);
          this.container.appendChild(canvas);
        })
      }, 1000)
    }, {...this.state.options, value: this.props.value })
    // cm.
  }

  render() {
    const { classes, value, onChange, theme: _theme, size, ...rest } = this.props
    return <div
      ref={this.setContainer}
      className={`${classes.editor} ${theme.classes.materialUI}`}
      {...rest}
    >
    </div>
  }

})