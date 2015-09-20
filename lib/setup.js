'use strict'

// This is run when the module is installed

const path = require('path')
const fs = require('fs')
const home = require('user-home')
const mkdirp = require('mkdirp')
const exec = require('child_process').execSync

const defaultConfig = require('./default-config.json')
const dir = path.resolve(home, './.remind-me')
const remindersFile = path.resolve(dir, './reminders.json')
const configFile = path.resolve(dir, './config.json')

// Create the following files, unless they already exist:
//
// ~/.remind-me/config.json
// ~/.remind-me/reminders.json

mkdirp(dir)

if (!fs.existsSync(remindersFile)) {
  fs.writeFileSync(remindersFile, '[]')
}

if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2))
}

// Add a crontab entry so upcoming reminders are checked for once a minute

require('crontab').load(function (err, crontab) {
  if (err) throw err

  // cron doesn't have `node` on its $PATH, so prepend it
  let nodeDir = path.dirname(exec('which node'))
  let pathString = `export PATH=${nodeDir}:$PATH;`
  let cronLogs = `>~/.remind-me/cron.stdout.log 2>~/.remind-me/cron.stderr.log`
  let cronString = `${pathString} remind sweep ${cronLogs}`

  // prevent duplicates
  crontab.remove({command: cronString})

  // sweep every minute
  crontab.create(cronString, '* * * * *')

  crontab.save(function (err, crontab) {
    if (err) throw err

    console.log('Success! Created a cron job to check for reminders every minute')
    console.log("Type `remind` for usage instructions.\n")
  })
})
