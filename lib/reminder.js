'use strict'

const parse = require('./parse')
const uuid = require('uuid')
const strftime = require('prettydate').strftime

module.exports = class Reminder {

constructor(msg) {

  if (msg && msg.task && msg.time) {
    // Object input
    // (Used by store when loading reminders from JSON on disk)
    this.task = msg.task
    this.time = msg.time
  } else {
    // String input
    var parsed = parse(msg)
    this.task = parsed.task
    this.time = parsed.time
  }

  this.date = new Date(this.time)
  this.notified_at = null
  this.id = uuid.v4()
}

get imminent() {
  return !this.notified_at && this.time < (Date.now() + 60000)
}

get day () {
  return strftime(this.date, '%A, %B %e').replace(/\s+/g, ' ')
}

get hour () {
  return strftime(this.date, '%l:%M %P')
}

get summary () {
  return `Ok, I'll remind you to "${this.task}" on ${this.day} at ${this.hour}`
}

notify() {
  console.log(`Hey you. It's time to ${this.task}`)

  

  // not implemented yet
  this.markAsNotified()
}

markAsNotified() {
  this.notified_at = new Date()
}

}
