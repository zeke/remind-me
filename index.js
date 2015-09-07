#!/usr/bin/env node

const fs = require('fs')
const exec = require('child_process').execSync

const usage = fs.readFileSync(__dirname + '/lib/usage.txt', 'utf8')
const Store = require(__dirname + '/lib/store')
const Config = require(__dirname + '/lib/config')
const Reminder = require(__dirname + '/lib/reminder')
const args = process.argv.slice(2)

if (!args.length) {
  console.log(usage)
  process.exit()
}

const action = args[0]

var store = new Store()
var config = new Config()

switch (action) {
  case 'sweep':
    exec('echo I am here to sweep')
    store.sweep()
    break
  case 'me':
    var reminder = new Reminder(args.join(' '))
    store.add(reminder)
    console.log(reminder.creationReply)
    break
  case 'list':
    console.log(store.list())
    exec(`echo I am not implemented yet`)
    break
  case 'cancel':
    exec(`echo I am not implemented yet`)
    break
  case 'edit':
    exec(`$EDITOR ${store.file}`)
    break
  case 'config':
    exec(`$EDITOR ${config.file}`)
    break
  default:
    console.log(`Unrecognized command "${action}"\n`)
    console.log(usage)
}
