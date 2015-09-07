'use strict'

const path = require('path')
const fs = require('fs')
const home = require('user-home')
const mkdirp = require('mkdirp')

module.exports = class Config {

  constructor (dir) {
    // Allow a custom directory to be set, but defaults to ~/.remind-me
    // This allows tests to use a /tmp dir without clobbering real data
    if (!dir) dir = path.resolve(home, './.remind-me')

    this.dir = dir
    this.file = path.resolve(dir, './config.json')
    this.defaults = {
      desktop: {
        enabled: true
      },
      say: {
        enabled: true,
        voice: 'Samantha'
      },
      twilio: {
        enabled: false,
        accountSID: '',
        authToken: '',
        fromPhoneNumber: '+13334445555',
        toPhoneNumber:  '+6667778888'
      },
      slack: {
        enabled: false,
        hookURL: '',
        channel: '',
        username: ''
      }
    }

    mkdirp(path.dirname(this.file))
    var self = this

    if (fs.existsSync(this.file)) {
      // Load existing config file
      var rawConfig = JSON.parse(fs.readFileSync(this.file))
      // Object.keys(rawConfig).forEach(key => this[key] = rawConfig[key]);
      Object.keys(rawConfig).forEach(function(key){
        self[key] = rawConfig[key]
      })
    } else {
      // Create new config file with defaults
      fs.writeFileSync(this.file, JSON.stringify(this.defaults, null, 2))
      // Object.keys(this.defaults).forEach(key => this[key] = this.defaults[key]);
      Object.keys(this.defaults).forEach(function(key){
        self[key] = this.defaults[key]
      })
    }

  }

}
