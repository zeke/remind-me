#!/usr/bin/env node

const fs = require('fs')
const parse = require('./lib/parse')
const strftime = require('prettydate').strftime
const usage = fs.readFileSync('./usage.txt', 'utf8')
// const relative = require('relative-date')

if (!process.parent) {
  var args = process.argv.slice(2)


  if (!args.length) {
    console.log(usage)
    process.exit()
  }

  var action = args[0]

  switch(action) {
    case 'agent':
      require('child_process').execSync('say i am the agent')
      // Pending: parse the task list and look for
      // stuff that's supposed to happen this minute
      break
    case 'me':
      var parsed = parse(args.join(' '))
      var task = parsed.task
      var day = strftime(parsed.time, '%A, %B%e')
      var hour = strftime(parsed.time, '%l:%M %P')
      console.log(`Ok, I'll remind you to "${task}" on ${day} at ${hour}`)
      break
    default:
      console.log(`Unrecognized command "${action}"\n`)
      console.log(usage)
  }

}
