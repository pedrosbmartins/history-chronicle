import Handlebars from 'handlebars'
import todayJSON from '../data/today.json'

interface Data {
  dateLabel: string
  events: Newsitem[]
}

interface Newsitem {
  headline: string
  year: number
  subtitle: string
  url: string
  hasImage?: boolean
  hasTopDivider?: boolean
  hasBottomDivider?: boolean
  headlineStyle?: string
}

const data = todayJSON as Data

const templateSource = document.getElementById('newsitem-template')!.innerHTML
const template = Handlebars.compile<Newsitem>(templateSource)

Handlebars.registerHelper('placeholderText', placeholderText)

const $dateLabel = document.getElementById('header-date-label') as HTMLHeadingElement
const $newsitems = document.querySelectorAll<HTMLDivElement>('.newsitem')

$dateLabel.innerText = data.dateLabel

$newsitems.forEach(($item, i) => {
  const { events } = data
  if (events[i]) {
    const headlineStyle = randomHeadlineStyle()
    const newsitem = {
      ...events[i],
      hasImage: $item.classList.contains('display-image'),
      hasBottomDivider: $item.classList.contains('divider-bottom'),
      hasTopDivider: $item.classList.contains('divider-top'),
      headlineStyle
    }
    $item.innerHTML = template(newsitem)
  }
})

function placeholderTextLine(size: number) {
  return `<div class="flex-1 h-8 bg-gray-200" style="width: ${size}%"></div>`
}

function placeholderText() {
  const fullLineCount = 3
  const fullLine = placeholderTextLine(100)

  const partialLineSize = Math.round(100 * (0.25 + Math.random() * 0.75))
  const partialLine = placeholderTextLine(partialLineSize)

  const result = `<div class='flex flex-col gap-1 h-8'>
          ${[...new Array(fullLineCount)].map(() => fullLine).join('\n')}
          ${partialLine}
        </div>`

  return result
}

function randomHeadlineStyle() {
  const transform = Math.random() < 0.75 ? 'uppercase' : ''
  const style = Math.random() < 0.75 ? 'italic' : ''
  const weight = Math.random() < 0.5 ? 'font-extrabold' : 'font-normal'
  return `${transform} ${style} ${weight}`
}
