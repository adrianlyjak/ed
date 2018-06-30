import * as CodeMirror from 'react-codemirror'
import * as React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import styles from './Editor.module.css'

import '../codemirror/theme/variable.css'
import 'codemirror/theme/solarized.css'

const test = `

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6


*italic*
**bold**
[link](http://example.com)

~~Mistaken text.~~

> quote from some guy somewhere

- list of things
- this is another thing
- this is a final thing

1. numbered list
2. so number
3. such wow

------------------------

Cough hairball, eat toilet paper attempt to leap between furniture but woefully miscalibrate and bellyflop onto the floor; what's your problem? i meant to do that now i shall wash myself intently for i'm bored inside, let me out i'm lonely outside, let me in i can't make up my mind whether to go in or out, guess i'll just stand partway in and partway out, contemplating the universe for half an hour how dare you nudge me with your foot?!?! leap into the air in greatest offense! for if it smells like fish eat as much as you wish and sleep nap, yet sniff catnip and act crazy. With tail in the air mrow or loves cheeseburgers yet pet right here, no not there, here, no fool, right here that other cat smells funny you should really give me all the treats because i smell the best and omg you finally got the right spot and i love you right now or scratch at the door then walk away mewl for food at 4am knock dish off table head butt cant eat out of my own dish. 


`

export class Editor extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      value: test,
      options: {
        lineWrapping: true,
        mode: {
          name: 'gfm',
          highlightFormatting: true,
        },
        theme: 'variable'
      }
    }


  }


  render() {
    return <div>
      <CodeMirror
        className={styles.Editor}
        options={this.state.options}
        value={this.state.value}
        onChange={this.onValueChanged} />
    </div>
  }

  onThemeChanged = (event) => {
    this.setState({ options: { ...this.state.options, theme: event.target.value } })
  }

  onValueChanged = (value) => {
    this.setState({ value })
  }

}