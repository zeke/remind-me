#!/usr/bin/env node

const fs = require('fs')
const parse = require('./lib/parse')
const strftime = require('prettydate').strftime
const relative = require('relative-date')

if (!process.parent) {
  var args = process.argv.slice(2)

  if (!args.length) {
    console.log(fs.readFileSync('./usage.txt', 'utf8'))
    process.exit()
  }

  var parsed = parse(args.join(' '))

  var task = parsed.task
  var day = strftime(parsed.time, '%A, %B%e')
  var hour = strftime(parsed.time, '%l:%M %P')

  console.log(`Ok, I'll remind you to "${task}" on ${day} at ${hour}`)

}
