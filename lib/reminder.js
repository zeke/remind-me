'use strict'

const uuid = require('uuid')
const strftime = require('prettydate').strftime

const parse = require(__dirname + '/parse')
const config = require(__dirname + '/config')
const notifiers = require('require-dir')(__dirname + '/notifiers/')

module.exports = class Reminder {

constructor(msg) {
  if (msg && msg.task && msg.time) {
    // Object input
    // (Used when loading reminders from JSON on disk)
    this.task = msg.task
    this.time = msg.time
    this.notified_at = msg.notified_at
  } else {
    // String input
    // (Used when parsing natural-language input from a user)
    var parsed = parse(msg)
    this.task = parsed.task
    this.time = parsed.time
    this.notified_at = null
  }

  this.id = uuid.v4()
}

get imminent() {
  return !this.notified_at && this.time < (Date.now() + 60000)
}

get day () {
  return strftime(new Date(this.time), '%A, %B %e').trim().replace(/\s+/g, ' ')
}

get hour () {
  return strftime(new Date(this.time), '%l:%M %P').trim().replace(/\s+/g, ' ')
}

get summary () {
  return `"${this.task}" on ${this.day} at ${this.hour}`
}

get creationReply () {
  return `Ok, I'll remind you to ${this.summary}`
}

notify() {
  var self = this
  Object.keys(notifiers).forEach(function(name){
    if (process.env.NODE_ENV != 'test') {
      notifiers[name](self.task, config[name])
    }
  })
  this.markAsNotified()
}

markAsNotified() {
  this.notified_at = new Date()
}

}
