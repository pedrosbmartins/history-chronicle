import Handlebars from 'handlebars'
import todayJSON from '../data/today.json'

interface Newsitem {
  headline: string
  year: number
  imageURL: string
  hasImage?: boolean
  hasTopDivider?: boolean
  hasBottomDivider?: boolean
}

const data = todayJSON as Newsitem[]

const $newsitems = document.querySelectorAll<HTMLDivElement>('.newsitem')

var source = document.getElementById('newsitem-template')!.innerHTML
var template = Handlebars.compile<Newsitem>(source)

function placeholderTextLine(size: number) {
  return `<div class="flex-1 h-8 bg-gray-200" style="width: ${size}%"></div>`
}

Handlebars.registerHelper('placeholderText', () => {
  const fullLineCount = 3
  const fullLine = placeholderTextLine(100)

  const partialLineSize = Math.round(100 * (0.25 + Math.random() * 0.75))
  const partialLine = placeholderTextLine(partialLineSize)

  const result = `<div class='flex flex-col gap-1 h-8'>
          ${[...new Array(fullLineCount)].map(() => fullLine).join('\n')}
          ${partialLine}
        </div>`

  return result
})

$newsitems.forEach(($item, i) => {
  if (data[i]) {
    const newsitem = {
      ...data[i],
      hasImage: $item.classList.contains('display-image'),
      hasBottomDivider: $item.classList.contains('divider-bottom'),
      hasTopDivider: $item.classList.contains('divider-top')
    }
    $item.innerHTML = template(newsitem)
  }
})
