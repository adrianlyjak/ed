import nouns from './nouns'
import adjectives from './adjectives'

function randomElement<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)]
}

export default function getPhrase(): string {
  return `${randomElement(adjectives)} ${randomElement(nouns)}`
}