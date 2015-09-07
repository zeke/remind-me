'use strict'

const uuid = require('uuid')
const strftime = require('prettydate').strftime

const parse = require(__dirname + '/parse')
const config = new (require(__dirname + '/config'))()
const notifiers = require('require-dir')(__dirname + '/notifiers/')

module.exports = class Reminder {

constructor(msg) {
  if (msg && msg.task && msg.time) {
    // Object input
    // (Used when loading reminders from JSON on disk)
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

get creationReply () {
  return `Ok, I'll remind you to "${this.task}" on ${this.day} at ${this.hour}`
}

notify() {
  var self = this
  Object.keys(notifiers).forEach(function(name){
    notifiers[name](self.task, config[name])
  })
  this.markAsNotified()
}

markAsNotified() {
  this.notified_at = new Date()
}

}
