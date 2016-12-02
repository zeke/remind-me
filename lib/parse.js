'use strict'

const assert = require('assert')
const dateparser = require('dateparser').parse
const easyPattern = require('easypattern')
const chrono = require('chrono-node')
const openGithubIssue = require('./issue')

const patterns = [
  'to {task} on {day} at {time}',
  'to {task} on {time}',
  'to {task} at {time}',
  'to {task} in {interval}',
  'in {interval} to {task}',
  'on {time} to {task}',
  'at {time} to {task}',
  '{time} to {task}',
  'that {task} on {time}',
  'that {task} at {time}',
  'that {task} in {interval}',
  'to {task} tomorrow'
]

/*
 * Ensure that the reminder time is in the future.
 * TODO: Loop (with sanity checks) time increments until time is 
 *       actually in the future.
 */
function futurizeReminder(time, pattern, input) {

  var t = new Date(time)
  var now = new Date()

  if (t >= now) {
    return t
  }

  var match = pattern.match(input);
  var daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday']

  if (match.day || (match.time && (daysOfWeek.indexOf(match.time.trim().toLowerCase()) != -1))) {
    // If day of week included in time string, try adding a week.
    return new Date(t.setDate(t.getDate() + 7))
  }

  // Try adding 12 hours (am vs pm)
  t = new Date(t.setTime(t.getTime() + (12 * 60 * 60 * 1000))) // add 12 hours
  if (t > now) {
    return t
  }

  // Add a year
  t = t.setYear(t.getYear() + 1)
  if (t > now) {
    return t
  }

  // Still in the past? I give up.
  return time
}

module.exports = function parse (input) {
  assert(typeof input, 'string', 'input must be a string')

  let result = {
    input: input
  }

  input = input
    .replace(/^remind /i, '')
    .replace(/^me /i, '')
    .replace(/ to /ig, '__to__') // hack to circumvent greedy regex matches for the wrong 'to'
    .replace(/__to__/i, ' to ')

  patterns.some(function (_) {
    var pattern = easyPattern(_)
    if (pattern.test(input)) {
      result = pattern.match(input)

      // special case for trailing tomorrow
      if (!result.time &&  _.match(/tomorrow$/i)) {
        result.time = chrono.parse('tomorrow')[0].start.date()
      }

      if (result.interval) {
        result.interval = dateparser(result.interval).value
        result.time = new Date(new Date().getTime() + result.interval)
      }

      // undo the regex 'to' hack
      result.task = result.task.replace(/__to__/ig, ' to ')

      if (typeof result.time === 'string') {
        if (result.day) {
          result.time = result.day + ' at ' + result.time
        }
        if (result.time.length == 1) {
          // chrono barfs without a full time string
          result.time = result.time + ':00'
        }
        result.time = chrono.parse(result.time)[0].start.date()
      }

      // Chrono can return a time in the past when information is limited.
      console.log('1', result.time);
      result.time = futurizeReminder(result.time, pattern, input);
      console.log('2', result.time);
      return true
    }

  })

  if (result.time && result.task) {
    return result
  } else {
    openGithubIssue(result)
    throw(new Error(`unrecognized pattern: ${result.input}`))
  }
}
