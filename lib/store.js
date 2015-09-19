'use strict'

const path = require('path')
const fs = require('fs')
const home = require('user-home')
const mkdirp = require('mkdirp')

const Reminder = require('./reminder')

module.exports = class Store {

  constructor () {
    this.file = process.env.REMIND_STORE_PATH || path.resolve(home, './.remind-me/reminders.json')

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
    var list = this.reminders
      .filter(function(reminder){
        return !reminder.notified_at
      })
      .map(function(reminder){
        return reminder.summary
      })

    if (list.length) {
      return list.join('\n')
    } else {
      return "No upcomping reminders. You're free!"
    }
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
