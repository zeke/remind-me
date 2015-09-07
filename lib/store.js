'use strict'

const path = require('path')
const fs = require('fs')
const home = require('user-home')
const mkdirp = require('mkdirp')

const Reminder = require('./reminder')

module.exports = class Store {

  constructor (dir) {
    // Allow a custom directory to be set, but defaults to ~/.remind-me
    // This allows tests to use a /tmp dir without clobbering real data
    if (!dir) dir = path.resolve(home, './.remind-me')

    this.dir = dir
    this.file = path.resolve(dir, './reminders.json')

    mkdirp(path.dirname(this.file))

    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, '[]')
    }

    // Instantiate a Reminder for each object in the file
    this.reminders = JSON.parse(fs.readFileSync(this.file, 'utf8'))
      .map(function(rawObject){
        return new Reminder(rawObject)
      })
  }

  add (reminder) {
    this.reminders.push(reminder)
    this.save()
  }

  list() {
    return this.reminders
      .filter(function(reminder){
        return !reminder.notified_at
      })
      .map(function(reminder){
        return reminder.summary
      })
      .join('\n')
  }

  sweep () {
    this.reminders
      .filter(function(reminder){
        return reminder.imminent
      })
      .forEach(function(reminder){
        reminder.notify()
      })
    this.save()
  }

  save () {
    fs.writeFileSync(this.file, JSON.stringify(this.reminders, null, 2))
  }

}
