import * as React from 'React'
import { WithStyles, createStyles, withStyles } from '@material-ui/core';


const backdropStyles = createStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
    background: 'linear-gradient(90deg, rgba(0,134,204,1) 0%, rgba(0,200,195,1) 100%)'
  }
})

export const Backdrop = withStyles(backdropStyles)(({
  classes,
  children,
  style
}: {
  classes: {root: string},
  children?: any,
  style?: any 
}) => {
  return <div className={classes.root} style={style}>{children}</div>
})