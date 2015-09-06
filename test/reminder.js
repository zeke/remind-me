/* globals describe, it */

const Reminder = require('../lib/reminder')
const assert = require('assert')
const strftime = require('prettydate').strftime
const relative = require('dateparser').parse

describe('Reminder', function () {
  var reminder = new Reminder('to boil some eggs in five minutes')

  it('has a task and a time', function () {
    assert.equal(reminder.task, 'boil some eggs')
    assert.equal(typeof reminder.time, 'number')
  })

  it('has a unique ID', function () {
    assert.ok(reminder.id)
    assert.equal(reminder.id.length, '36') // uuid v4
  })

  it('can be marked as notified', function () {
    assert.equal(reminder.notified_at, null)
    reminder.markAsNotified()
    assert.equal(
      strftime(reminder.notified_at, '%D%T'),
      strftime(new Date(), '%D%T')
    )
  })

  describe('imminent', function () {
    var old = new Reminder('to do stuff in 1 second')
    var soon = new Reminder('to do stuff in 30 seconds')
    var future = new Reminder('to do stuff in 90 seconds')

    it('is immininent when `time` is in the past or less than a minute in the future', function () {
      assert(old.imminent)
      assert(soon.imminent)
    })

    it('is not immininent when `time` is more than a minute from now', function () {
      assert(!future.imminent)
    })

    it('is not immininent if already marked as notified', function () {
      assert(old.imminent)
      old.markAsNotified()
      assert(!old.imminent)
    })
  })
})
