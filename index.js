#!/usr/bin/env node

const fs = require('fs')
const strftime = require('prettydate').strftime
// const relative = require('relative-date')
const usage = fs.readFileSync('./usage.txt', 'utf8')
const Store = require('./lib/store')
const Reminder = require('./lib/reminder')

if (!process.parent) {
  var args = process.argv.slice(2)

  if (!args.length) {
    console.log(usage)
    process.exit()
  }

  var action = args[0]

  switch (action) {
    case 'agent':
      require('child_process').execSync('say i am the agent')
      var store = new Store()
      store.sweep()
      // Pending: parse the task list and look for
      // stuff that's supposed to happen this minute
      break
    case 'me':
      var store = new Store()
      var reminder = new Reminder(args.join(' '))
      store.add(reminder)
      console.log(reminder.summary)
      break
    default:
      console.log(`Unrecognized command "${action}"\n`)
      console.log(usage)
  }

}
