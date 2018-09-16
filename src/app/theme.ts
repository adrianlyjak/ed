import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import cyan from '@material-ui/core/colors/cyan';
import blue from '@material-ui/core/colors/blue';

import createTheme from '../codemirror/theme/material-ui'
import injectSheet from 'react-jss'


export const mui = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
      // '"Merriweather"', 'serif'
    // ].join(', '),
  },
  palette: {
    type: 'light',
    primary: cyan,
    secondary: blue,
  }
})
export const theme = createTheme(mui)
