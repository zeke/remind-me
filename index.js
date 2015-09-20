#!/usr/bin/env node

const fs = require('fs')
const exec = require('child_process').execSync

const usage = fs.readFileSync(__dirname + '/lib/usage.txt', 'utf8')
const Store = require(__dirname + '/lib/store')
const Reminder = require(__dirname + '/lib/reminder')
const args = process.argv.slice(2)

if (!args.length) {
  console.log(usage)
  process.exit()
}

const action = args[0]

var store = new Store()

switch (action) {
  case 'sweep':
    store.sweep()
    break
  case 'me':
    var reminder = new Reminder(args.join(' '))
    store.add(reminder)
    console.log(reminder.creationReply)
    break
  case 'list':
    console.log(store.list())
    break
  case 'cancel':
    console.log('I am not implemented yet.')
    console.log('In the interim, use `remind edit` to remove the reminder manually')
    break
  case 'edit':
    exec(`$EDITOR ~/.remind-me/reminders.json`)
    break
  case 'config':
    exec(`$EDITOR ~/.remind-me/config.json`)
    break
  default:
    console.log(`Unrecognized command "${action}"\n`)
    console.log(usage)
}
