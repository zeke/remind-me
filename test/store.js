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
      store.add(new Reminder('test all the things', new Date()))
      assert.equal(store.reminders.length, 1)
    })

    it('saves the JSON file', function() {
      var dir = tmpDir().name
      store = new Store(dir)
      store.add(new Reminder('test all the things', new Date()))
      store.add(new Reminder('test even moar', new Date()))
      assert.equal(store.reminders.length, 2)

      store = new Store(dir)
      assert.equal(store.reminders.length, 2)
    })

  })

  describe('sweep', function(){




    it('finds all imminent reminders and calls the notify method on each', function() {
      store = new Store(tmpDir().name)
      store.add(new Reminder('do stuff', +new Date() - relative('3 days').value))
      store.add(new Reminder('do stuff', +new Date() + relative('59 seconds').value))
      store.add(new Reminder('do stuff', +new Date() + relative('61 seconds').value))

      assert.equal(store.reminders.length, 3)
      assert.equal(store.reminders.filter(function(_){return _.imminent}).length, 2)
      store.sweep()
      assert.equal(store.reminders.filter(function(_){return _.imminent}).length, 0)
    })

  })


})
