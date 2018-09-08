import jss from 'jss'

export default function createTheme(materialUI) {

  const {primary, secondary, grey} = materialUI.palette
  const simpleColorsArray = [
    ['cm-header', 
      { color: primary['100'] },
      {
        ...materialUI.typography.subheading,
        color: primary['A700'] 
      }, 
    ],
    ['cm-quote',  
      { color: secondary['300'] },
    ],
    ['cm-link', 
      { color: grey['500'] },
      { color: secondary['700'] }, 
    ],
    ['cm-url', 
      { color: secondary['400'] },
      { color: secondary['500'] }, 
    ],
    ['cm-em', 
      { color: primary['200'] },
      { color: primary['A700'] } 
    ],
    ['cm-strong', 
      { color: primary['200'] },
      { color: primary['A700'] }, 
    ], 
    ['cm-variable-2', 
      { color: primary['300'] }
    ],
    ['cm-comment',
      { color: grey['400'] },
      {
        color: secondary['600'],
        fontFamily: 'monospace'
      }
    ],
    ['cm-hr', 
      undefined, 
      {
        color: grey['400'],
        // display: 'block'
      }
    ]
  ]
  const simpleColors = simpleColorsArray.reduce(
    (sum, [name, higlight, element]) => ({
      ...sum,
      [`@global .${name}`]: element || {}, 
      [`@global .${name}.cm-formatting`]: higlight || {}
    }),
    {}
  )

  const shared = {
    ...materialUI.typography.body1
  }

  return jss.createStyleSheet({

    materialUI: {
      ...shared,
      '@global .cm-s-material-ui': {
          '@global .CodeMirror-selected': {
              background: materialUI.palette['primary']['100']
          },
          '@global .CodeMirror-line': {

          },
          '@global .cm-hr::after': { 
            content: "\"<hr />\"",
          },
          ...simpleColors,
          '&': { ...shared },
        }
      }

  }).attach()
}

//         .cm-s-variable .CodeMirror-selected { background: var(--color-selected); }
// .cm-s-variable .cm-header { color: var(--color-header); }
// .cm-s-variable .cm-header.cm-formatting { color: var(--color-header-highlight); }
// .cm-s-variable .cm-quote { color: var(--color-quote); }
// .cm-s-variable .cm-quote.cm-formatting { color: var(--color-quote-highlight); }
// .cm-s-variable .cm-link { color: var(--color-link); cursor: pointer; }
// .cm-s-variable .cm-link.cm-formatting { color: var(--color-link-highlight); cursor: pointer; }
// .cm-s-variable .cm-em { color: var(--color-em); }
// .cm-s-variable .cm-em.cm-formatting { color: var(--color-em-highlight); }
// .cm-s-variable .cm-variable-2 { color: var(--color-variable-2); }
// .cm-s-variable .cm-variable-2.cm-formatting { color: var(--color-variable-2-highlight); }
// .cm-s-variable .cm-hr {
//   color: transparent;
//   border-top: 1px solid var(--color-hr);
//   display: block;
// }


// /*
// largely copy pasted from 
// Solarized theme for code-mirror
// http://ethanschoonover.com/solarized

// Styles relevant to markdown appear above
// */

// .cm-s-variable .CodeMirror-widget {
//   text-shadow: none;
// }


// .cm-s-variable .cm-keyword { color: var(--color-solar-orange); }
// .cm-s-variable .cm-atom { color: var(--color-solar-magenta); }
// .cm-s-variable .cm-number { color: var(--color-solar-magenta); }
// .cm-s-variable .cm-def { color: var(--color-solar-cyan); }

// .cm-s-variable .cm-variable { color: var(--color-base0); }
// .cm-s-variable .cm-variable-3, .cm-s-variable .cm-type { color: var(--color-solar-violet); }

// .cm-s-variable .cm-property { color: var(--color-solar-cyan); }
// .cm-s-variable .cm-operator { color: var(--color-solar-violet); }

// .cm-s-variable .cm-comment { color: var(--color-base01); font-style:italic; }

// .cm-s-variable .cm-string { color: var(--color-solar-green); }
// .cm-s-variable .cm-string-2 { color: var(--color-solar-yellow); }

// .cm-s-variable .cm-meta { color: var(--color-solar-green); }
// .cm-s-variable .cm-qualifier { color: var(--color-solar-yellow); }
// .cm-s-variable .cm-builtin { color: var(--color-solar-magenta); }
// .cm-s-variable .cm-bracket { color: var(--color-solar-orange); }
// .cm-s-variable .CodeMirror-matchingbracket { color: var(--color-solar-green); }
// .cm-s-variable .CodeMirror-nonmatchingbracket { color: var(--color-solar-red); }
// .cm-s-variable .cm-tag { color: var(--color-base1); }
// .cm-s-variable .cm-attribute { color: var(--color-solar-cyan); }

// .cm-s-variable .cm-special { color: var(--color-solar-violet); }

// .cm-s-variable .cm-error,
// .cm-s-variable .cm-invalidchar {
//   color: var(--color-base01);
//   border-bottom: 1px dotted var(--color-solar-red);
// }

// /* Editor styling */



// /* Remove gutter border */
// .cm-s-variable .CodeMirror-gutters {
//   border-right: 0;
// }

// /* Common */
// .cm-s-variable .CodeMirror-linenumber {
//   padding: 0 5px;
// }
// .cm-s-variable .CodeMirror-guttermarker-subtle { color: var(--color-base01); }

// .cm-s-variable .CodeMirror-gutter .CodeMirror-gutter-text {
//   color: var(--color-base01);
// }

// /* Cursor */
// .cm-s-variable .CodeMirror-cursor { border-left: 1px solid #819090; }


//       }
//     }
