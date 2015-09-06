/* globals describe, it */

const Reminder = require('../lib/reminder')
const assert = require('assert')
const strftime = require('prettydate').strftime
const relative = require('dateparser').parse

describe('Reminder', function () {
  var reminder = new Reminder('boil some eggs', new Date())

  it('has a task and a time', function () {
    assert.equal(reminder.task, 'boil some eggs')
    assert.equal(typeof reminder.time, 'object')
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
    var old = new Reminder('do stuff', +new Date() - relative('3 days').value)
    var soon = new Reminder('do stuff', +new Date() + relative('59 seconds').value)
    var future = new Reminder('do stuff', +new Date() + relative('61 seconds').value)

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
