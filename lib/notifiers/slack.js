var Slack = require('node-slack')

module.exports = function (task, config) {
  if (
    config &&
    config.enabled &&
    config.hookURL &&
    config.channel &&
    config.username
  ) {
    var slack = new Slack(config.hookURL)
    slack.send({
      text: task,
      channel: config.channel,
      username: config.username
    })
  }
}
