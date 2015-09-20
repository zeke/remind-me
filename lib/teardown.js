'use strict'

// This is run when the module is uninstalled

const path = require('path')
const home = require('user-home')
const cp = require('cp').sync
const rm = require('rimraf').sync

const dir = path.resolve(home, './.remind-me')
const configFile = path.resolve(dir, './config.json')
const configBackupFile = path.resolve(dir, './config.backup.json')
const remindersFile = path.resolve(dir, './reminders.json')
const remindersBackupFile = path.resolve(dir, './reminders.backup.json')

// Make backups.. it sucks to lose config files

cp(configFile, configBackupFile)
cp(remindersFile, remindersBackupFile)

console.log(`Created ${configBackupFile}`)
console.log(`Created ${remindersBackupFile}`)

// Delete the originals, so a fresh install will be... fresh.

rm(remindersFile)
rm(configFile)

// Remove the sweeper from crontab

require('crontab').load(function (err, crontab) {
  if (err) throw err

  crontab.remove({command: 'remind sweep'})

  crontab.save(function (err, crontab) {
    if (err) throw err
    console.log('Removed cron job. Run `crontab -l` to verify.')
    console.log('\nTo reinstall, run: npm i -g remind-me')
  })
})
