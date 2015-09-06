'use strict'

const uuid = require('uuid')

module.exports = class Reminder {

constructor(task, time) {
  this.task = task
  this.time = time
  this.notified_at = null
  this.id = uuid.v4()
}

get imminent() {
  return !this.notified_at && this.time < (Date.now() + 60000)
}

get timeFromNowInWords() {
  return `You know, ${this.notified_at} or whatever`
}

notify() {
  // not implemented yet
  this.markAsNotified()
}

markAsNotified() {
  this.notified_at = new Date()
}

}
