#!/usr/bin/env node

const fs = require('fs')

const usage = fs.readFileSync(__dirname + '/lib/usage.txt', 'utf8')
const Store = require(__dirname + '/lib/store')
const Reminder = require(__dirname + '/lib/reminder')
const args = process.argv.slice(2)

if (!args.length) {
  console.log(usage)
  process.exit()
}

const action = args[0]

switch (action) {
  case 'sweep':
    require('child_process').execSync('echo I am here to sweep')
    var store = new Store()
    store.sweep()
    break
  case 'me':
    var store = new Store()
    var reminder = new Reminder(args.join(' '))
    store.add(reminder)
    console.log(reminder.summary)
    break
  case 'edit':
    var store = new Store()
    require('child_process').execSync(`$EDITOR ${store.file}`)
    break
  default:
    console.log(`Unrecognized command "${action}"\n`)
    console.log(usage)
}
