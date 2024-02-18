import puppeteer from 'puppeteer'
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:8080/')
  await page.setViewport({ width: 1072, height: 1448 })
  await page.screenshot({ path: 'test.png' })
  await browser.close()
})()
