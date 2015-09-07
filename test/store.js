/* globals afterEach, beforeEach, describe, it */

const Store = require('../lib/store')
const Reminder = require('../lib/reminder')
const tmpDir = require('tmp').dirSync
const assert = require('assert')
const rimraf = require('rimraf').sync
const relative = require('dateparser').parse

var store

describe('Store', function () {

  beforeEach(function(){
    store = new Store(tmpDir().name)
  })

  afterEach(function(){
    rimraf(store.dir)
  })

  it('is an empty array', function() {
    assert.equal(store.reminders.length, 0)
    // assert.equal(require(store.file).length, 0)
  })

  describe('add', function(){

    it('adds to the reminders array', function() {
      store = new Store(tmpDir().name)
      store.add(new Reminder('to test all the things in 1 second'))
      assert.equal(store.reminders.length, 1)
    })

    it('saves the JSON file', function() {
      var dir = tmpDir().name
      store = new Store(dir)
      store.add(new Reminder('to test all the things in two days'))
      store.add(new Reminder('to test moar things in three days'))
      assert.equal(store.reminders.length, 2)

      store = new Store(dir)
      assert.equal(store.reminders.length, 2)
    })

  })

  describe('sweep', function(){
    this.timeout(10000)
    it('finds all imminent reminders and calls the notify method on each', function() {
      store = new Store(tmpDir().name)
      store.add(new Reminder('to one in 1 second'))
      store.add(new Reminder('to two in 30 seconds'))
      store.add(new Reminder('to take a deep breath in 90 seconds'))

      assert.equal(store.reminders.length, 3)
      assert.equal(store.reminders.filter(function(_){return _.imminent}).length, 2)
      store.sweep()
      assert.equal(store.reminders.filter(function(_){return _.imminent}).length, 0)
    })

  })


})
