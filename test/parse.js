'use strict'

/* globals describe, it */

const parse = require('../lib/parse')
const assert = require('assert')
const relative = require('dateparser').parse

describe('parse', function () {

  describe('formats', function() {
    it('remind me in {intervalHours} to {task}', function () {
      let _ = parse('me in 2 hours to go to bed')
      assert.equal(_.interval, relative('2 hours').value)
      assert.equal(_.task, 'go to bed')
    })

    it('remind me in {intervalDays} to {task}', function () {
      let _ = parse('me in three days to meditate for one hour')
      assert.equal(_.interval, relative('3 days').value)
      assert.equal(_.task, 'meditate for one hour')
    })

    it('remind me in {intervalWeeks} to {task}', function () {
      let _ = parse('remind me in 2 weeks to celebrate fortnights')
      assert.equal(_.interval, relative('2 weeks').value)
      assert.equal(_.task, 'celebrate fortnights')
    })

    it('remind me that {task} in {interval}', function () {
      let _ = parse('remind me that roses are red in five minutes')
      assert.equal(_.interval, relative('5 minutes').value)
      assert.equal(_.task, 'roses are red')
    })

    it('remind me that {task} on {date} at {time}', function () {
      let _ = parse('remind me that violets are blue on Sunday at 3pm')
      assert.equal(_.time.getDay(), 0)
      assert.equal(_.time.getHours(), 15)
      assert.equal(_.task, 'violets are blue')
    })

    it('remind me that {task} on {day}', function () {
      let _ = parse('remind me that love is in the air on Friday')
      assert.equal(_.time.getDay(), 5)
      assert.equal(_.time.getHours(), 12)
      assert.equal(_.task, 'love is in the air')
    })

    it('remind me at {time} to {task}', function () {
      let _ = parse('remind me at 11:59pm to go to bed')
      assert.deepEqual(_.time.getDate(), (new Date()).getDate())
      assert.equal(_.time.getHours(), 23)
      assert.equal(_.time.getMinutes(), 59)
      assert.equal(_.task, 'go to bed')
    })

    it('remind me at {timeWithSpaceBetweenPM} to {task}', function () {
      let _ = parse('remind me at 9 pm to wake up')
      assert.deepEqual(_.time.getDate(), (new Date()).getDate())
      assert.equal(_.time.getHours(), 21)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'wake up')
    })


    it('remind me on {day} at {time} to {task}', function () {
      let _ = parse('remind me on saturday at 2:30 pm to go to bed')
      assert.equal(_.time.getDay(), 6)
      assert.equal(_.time.getHours(), 14)
      assert.equal(_.time.getMinutes(), 30)
      assert.equal(_.task, 'go to bed')
    })

    it('remind me to {task} on {day} at {time}', function () {
      let _ = parse('remind me to cancel something on October 13th at 3:30 PM')
      assert.equal(_.time.getMonth(), 9)
      assert.equal(_.time.getHours(), 15)
      assert.equal(_.time.getMinutes(), 30)
      assert.equal(_.task, 'cancel something')
    })

    it('remind me at {timeWithHourOnly} to {task}', function() {
      let _ = parse('remind me at 9 to go golfing')
      assert(_.time > Date.now())
      assert((_.time.getHours() == 9) || (_.time.getHours() == 21))
    })

    it('remind me {weekday} to {task}', function () {
      var dow = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday',
        'friday', 'saturday'];
      for (var i = 0; i < dow.length; i++) {
        let _ = parse('remind me ' + dow[i] + ' to prepare for the weekend')
        assert.equal(_.time.getDay(), i)
        assert.equal(_.task, 'prepare for the weekend')
      }
    })

    it('remind me on {date} at {time} to {task}', function () {
      let _ = parse('remind me on May 23 at 2pm to prepare for the weekend')
      assert.equal(_.time.getMonth(), 4)
      assert.equal(_.time.getDate(), 23)
      assert.equal(_.time.getHours(), 14)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'prepare for the weekend')
    })

    it('remind me to {task} tomorrow', function () {
      let _ = parse('remind me to wake up tomorrow')
      var tomorrowDate = (new Date()).getDate() + 1
      if (tomorrowDate > 31) tomorrowDate = 1
      assert.equal(_.time.getDate(), tomorrowDate)
      assert.equal(_.time.getHours(), 12)
      assert.equal(_.time.getMinutes(), 0)
      assert.equal(_.task, 'wake up')
    })

    it('remind me to {task} tomorrow at {time}')//, function () {
    //   let _ = parse('remind me to call mom tomorrow at 8')
    //   var tomorrowDate = (new Date()).getDate() + 1
    //   if (tomorrowDate > 31) tomorrowDate = 1
    //   assert.equal(_.time.getDate(), tomorrowDate)
    //   assert.equal(_.time.getHours(), 8)
    //   assert.equal(_.time.getMinutes(), 0)
    //   assert.equal(_.task, 'call mom')
    // })


  })

  describe('unrecognizable formats', function () {
    it('handles curbevalls', function () {
      assert.throws(
        function() {
          parse('remind me to throw a curveball')
        },
        /unrecognized pattern: remind me to throw a curveball/
      );
    })
  })

  describe('defaults', function () {
    it('defaults to 12pm if day is specified but time is not', function () {
      let _ = parse('remind me thursday to do something')
      assert.equal(_.time.getHours(), 12)
      assert.equal(_.task, 'do something')
    })

  })

})
