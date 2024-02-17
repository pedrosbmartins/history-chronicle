#!/usr/bin/env node

import { Command } from 'commander'
import { writeFile } from 'fs/promises'
import OpenAI from 'openai'

const program = new Command()

program
  .option('-m, --month <number>', 'month, an integer between 1 and 12')
  .option('-d, --day <number>', 'day, an integer between 1 and 31')
  .action(async options => {
    if (process.env['OPENAI_API_KEY'] === undefined) {
      console.warn('You must have an OPENAI_API_KEY env set to generate headlines')
      process.exit(1)
    }

    const month = String(options.month).padStart(2, '0')
    const day = String(options.day).padStart(2, '0')

    console.info('===========================')
    console.info('The History Chronicle')
    console.info('data-loader tool')
    console.info(`Processing month ${month}, day ${day}`)
    console.info('===========================')

    const rawEvents = await loadEvents(month, day)
    let events = rawEvents.selected.map((event: any) => ({
      originalText: event.text,
      year: event.year,
      subtitle: event.pages[0].titles.normalized,
      url: event.pages[0].content_urls.desktop.page
    }))

    const headlines = await generateHeadlines(events)

    events = events.map((event: any, i: number) => ({ ...event, headline: headlines[i] }))

    const filePath = `./data/${month}/${month}${day}.json`
    console.info(`Writing to file ${filePath}`)
    await writeFile(filePath, JSON.stringify(events))

    console.info('Done')
  })

program.parse()

async function loadEvents(month: string, day: string) {
  console.info('Wikipedia: fetching events from onthisday API...')
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/${month}/${day}`
  const retryCount = 3
  let json, error
  for (let i = 0; i < retryCount; i++) {
    try {
      console.info(`Attempt ${i + 1} of ${retryCount}`)
      const response = await fetch(url)
      json = await response.json()
      break
    } catch (e) {
      error = e
    }
  }
  if (json === undefined) {
    console.error(`Could not load data from Wikipedia: ${error}`)
    process.exit(1)
  }
  return json
}

async function generateHeadlines(events: Array<{ originalText: string }>) {
  const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })
  const prompt = [
    'You are an expert AI Journalism Assistant.',
    'You are given a list of sentences and must respond with a list of direct, short headlines in a professional newspaper style.',
    'Make sure to include the most important information, such as the name of places and/or people.',
    'Return only a JSON array, like this: ["Headline 1...", "Headline 2...", ...]',
    'Sentences:',
    '```',
    events.map(event => `- ${event.originalText}`).join('\n'),
    '```'
  ].join('\n')
  console.info('OpenAI: generating event headlines...')
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    temperature: 0
  })
  const headlines = JSON.parse(completion.choices[0].message.content!) as any[]
  console.info(`OpenAI: generated ${headlines.length} headlines for ${events.length} events`)
  return headlines
}
