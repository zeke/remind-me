'use strict'

const path = require('path')
const home = require('user-home')

module.exports = require(
  process.env.REMIND_CONFIG_PATH ||
  path.resolve(home, './.remind-me/config.json')
)
