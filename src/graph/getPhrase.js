import nouns from './nouns'
import adjectives from './adjectives'

function randomElement(options) {
  return options[Math.floor(Math.random() * options.length)]
}

export default function getPhrase() {
  return `${randomElement(adjectives)} ${randomElement(nouns)}`
}