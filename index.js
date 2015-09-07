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

switch (action) {
  case 'sweep':
    exec('echo I am here to sweep')
    var store = new Store()
    store.sweep()
    break
  case 'me':
    var store = new Store()
    var reminder = new Reminder(args.join(' '))
    store.add(reminder)
    console.log(reminder.creationReply)
    break
  case 'list':
    exec(`echo I am not implemented yet`)
    break
  case 'cancel':
    exec(`echo I am not implemented yet`)
    break
  case 'edit':
    var store = new Store()
    exec(`$EDITOR ${store.file}`)
    break
  case 'config':
    var config = new Config()
    exec(`$EDITOR ${config.file}`)
    break
  default:
    console.log(`Unrecognized command "${action}"\n`)
    console.log(usage)
}
