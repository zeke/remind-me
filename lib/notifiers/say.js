const notifier = require('node-notifier')
const exec = require('child_process').execSync

module.exports = function (task, config) {
  if (
    config &&
    config.enabled
  ) {
    if (!config.voice) config.voice = 'Samantha'
    exec(`say --voice=${config.voice} '${task}'`)
  }
}
