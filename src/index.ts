import Handlebars from 'handlebars'
import todayJSON from '../data/today.json'

interface Data {
  dateLabel: string
  issue: string
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
  lastTextLineEnd?: string
}

const data = todayJSON as Data

const templateSource = document.getElementById('newsitem-template')!.innerHTML
const template = Handlebars.compile<Newsitem>(templateSource)

const $dateLabel = document.getElementById('header-date-label') as HTMLHeadingElement
const $issueLabel = document.getElementById('header-issue-label') as HTMLHeadingElement
const $newsitems = document.querySelectorAll<HTMLDivElement>('.newsitem')

$dateLabel.innerText = data.dateLabel
$issueLabel.innerText = data.issue

document.title = `The History Chronicle · ${data.dateLabel}`

const events = data.events.sort(() => 0.5 - Math.random())
$newsitems.forEach(($item, i) => {
  if (events[i]) {
    const newsitem = {
      ...events[i],
      hasImage: $item.classList.contains('display-image'),
      hasBottomDivider: $item.classList.contains('divider-bottom'),
      hasTopDivider: $item.classList.contains('divider-top'),
      headlineStyle: randomHeadlineStyle(),
      lastTextLineEnd: randomLastTextLineEnd()
    }
    $item.innerHTML = template(newsitem)
  } else {
    $item.parentElement!.remove()
  }
})

function randomHeadlineStyle() {
  const transform = Math.random() < 0.75 ? 'uppercase' : ''
  const style = Math.random() < 0.75 ? 'italic' : ''
  const weight = Math.random() < 0.5 ? 'font-extrabold' : 'font-normal'
  return `${transform} ${style} ${weight}`
}

function randomLastTextLineEnd() {
  const randomWidth = Math.round(30 + Math.random() * 50)
  return `w-[${randomWidth}%]`
}
