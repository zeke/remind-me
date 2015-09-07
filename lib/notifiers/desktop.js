const notifier = require('node-notifier')

module.exports = function (task, config) {
  if (
    config &&
    config.enabled
  ) {
    notifier.notify({
      title: 'Reminder',
      message: task,
      sound: true
    })
  }
}
