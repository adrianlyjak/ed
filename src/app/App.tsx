import * as React from 'react';
import { GraphView, createGraphViewState } from '../graph/GraphView';
import * as sess from '../session/loadSession';
import { IApplicationSession } from '../session/ApplicationSession';
import { MainMenu } from './MainMenu';
import { 
  Backdrop, LinearProgress, Typography, MuiThemeProvider, 
  withStyles, createStyles, Theme, Fade 
} from '@material-ui/core';
import { theme, mui } from './theme'
import { observer } from 'mobx-react';
import { ProjectSessionView } from './ProjectSessionView';


interface IAppState {
  loaded: boolean,
  mounted: boolean,
  failedToLoad: boolean,
  appSession?: IApplicationSession
}

@observer
export default class App extends React.Component<{}, IAppState, {}> {

  state: IAppState = {
    loaded: false,
    mounted: false,
    failedToLoad: false,
    appSession: null,
  }

  viewState = createGraphViewState()

  componentDidMount() {
    const ld = sess.loadApplicationSession()
    ld.then(sess => {
      this.setState({ loaded: true, appSession: sess })
    })
      .catch(e => {
        console.error(e)
        this.setState({ failedToLoad: true })
      });

      
    setTimeout(() => this.setState({mounted: true}), 1000)
  }

  render() {

    const appSession = this.state.appSession;
    const noProject = !appSession || (!appSession.currentProject && !appSession.loadingProject);
    const loaded = this.state.loaded;
    const projectSession = appSession && appSession.currentProjectSession
    const mounted = this.state.mounted
    return <MuiThemeProvider theme={mui}>
      <div>
        {
          (!loaded || appSession.loadingProject) &&
          <LinearProgress variant="indeterminate"></LinearProgress>
        }
        {
          loaded &&
          <MainMenu forceOpen={noProject} appSession={appSession} />
        }
        <Backdrop timeout={3000} open={mounted && (!loaded || noProject)} />
        {noProject && <Welcome />}
        {
          projectSession &&
          <ProjectSessionView projectSession={this.state.appSession.currentProjectSession} />
        }
      </div>
    </MuiThemeProvider>

  }
}


const welcomeStyles = ({
  palette
}: Theme) => {
  console.log(palette)
  return createStyles({
    root: {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-around'
    },
    container: {
      margin: 'auto',
    },
    light: {
      color: palette.background.default
    }
  })
}

const Welcome = withStyles(welcomeStyles)(({ classes }) => {
  return <div className={classes.root}><div className={classes.container}>
      <Typography className={classes.light} variant="display3" gutterBottom>Welcome!</Typography>
      <Typography className={classes.light} variant="display2" gutterBottom>Add a project to get started</Typography>
    </div>
  </div>
})
