const notifier = require('node-notifier')

module.exports = function(task, config) {
  notifier.notify({
    title: 'Reminder',
    message: task,
    sound: true,
    // sticky: true,
    // wait: true
  });
}
