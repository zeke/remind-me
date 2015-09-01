/* globals describe, it */

const parse = require('../lib/parse')
const assert = require('assert')
const relative = require('dateparser').parse

describe('parse', function () {

  describe('relative times', function () {
    it('in 2 hours', function () {
      var _ = parse('me in 2 hours to go to bed')
      assert.equal(_.interval, relative('2 hours').value)
      assert.equal(_.task, 'go to bed')
    })

    it('in three days', function () {
      var _ = parse('me in three days to meditate for one hour')
      assert.equal(_.interval, relative('3 days').value)
      assert.equal(_.task, 'meditate for one hour')
    })

    it('in 2 weeks', function () {
      var _ = parse('remind me in 2 weeks to celebrate fortnights')
      assert.equal(_.interval, relative('2 weeks').value)
      assert.equal(_.task, 'celebrate fortnights')
    })
  })

  describe('specific times', function () {
    it('at 11:59pm', function () {
      var _ = parse('remind me at 11:59pm to go to bed')
      assert.deepEqual(_.time.getDate(), (new Date()).getDate())
      assert.equal(_.time.getHours(), 23)
      assert.equal(_.time.getMinutes(), 59)
      assert.equal(_.task, 'go to bed')
    })

    it('at 9 pm', function () {
      var _ = parse('remind me at 9 pm to wake up')
      assert.deepEqual(_.time.getDate(), (new Date()).getDate())
      assert.equal(_.time.getHours(), 21)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'wake up')
    })

  })

  describe('specific days and times', function () {
    it('on saturday at 2:30pm', function () {
      var _ = parse('remind me on saturday at 2:30 pm to go to bed')
      assert.equal(_.time.getDay(), 6)
      assert.equal(_.time.getHours(), 14)
      assert.equal(_.time.getMinutes(), 30)
      assert.equal(_.task, 'go to bed')
    })

    it('friday', function () {
      var _ = parse('remind me friday to prepare for the weekend')
      assert.equal(_.time.getDay(), 5)
      assert.equal(_.task, 'prepare for the weekend')
    })

    it('May 23 at 2pm', function () {
      var _ = parse('remind me on May 23 at 2pm to prepare for the weekend')
      assert.equal(_.time.getMonth(), 4)
      assert.equal(_.time.getDate(), 23)
      assert.equal(_.time.getHours(), 14)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'prepare for the weekend')
    })

    it('tomorrow (trailing)', function () {
      var _ = parse('remind me to wake up tomorrow')
      tomorrowDate = (new Date()).getDate()+1
      if (tomorrowDate > 31) tomorrowDate = 1
      assert.equal(_.time.getDate(), tomorrowDate)
      assert.equal(_.time.getHours(), 12)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'wake up')
    })

  })

  describe('defaults', function() {

    it('defaults to 12pm if day is specified but time is not', function() {
      var _ = parse('remind me thursday to do something')
      assert.equal(_.time.getHours(), 12)
      assert.equal(_.task, 'do something')
    })

    it('defaults to one hour from now if no time or date is specified')

  })

})
