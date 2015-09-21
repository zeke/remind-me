'use strict'

const assert = require('assert')
const dateparser = require('dateparser').parse
const easyPattern = require('easypattern')
const chrono = require('chrono-node')
const openGithubIssue = require('./issue')

const patterns = [
  'to {task} at {time}',
  'to {task} in {interval}',
  'in {interval} to {task}',
  'on {time} to {task}',
  'at {time} to {task}',
  '{time} to {task}',
  'to {task} tomorrow'
]

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
      if (!result.time && _.match(/tomorrow$/i)) {
        result.time = chrono.parse('tomorrow')[0].start.date()
      }

      if (result.interval) {
        result.interval = dateparser(result.interval).value
        result.time = Date.now() + result.interval
      }

      // undo the regex 'to' hack
      result.task = result.task.replace(/__to__/ig, ' to ')

      if (typeof result.time === 'string') {
        result.time = chrono.parse(result.time)[0].start.date()
      }

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
