module.exports = function (task, config) {
  if (
    config &&
    config.enabled &&
    config.accountSID &&
    config.authToken &&
    config.recipientPhoneNumber &&
    config.senderPhoneNumber
  ) {
    var twilio = require('twilio')(config.twilio.accountSID, config.twilio.authToken)
    twilio.sendMessage({
      to: config.twilio.toPhoneNumber,
      from: config.twilio.fromPhoneNumber,
      body: task
    }, function (err, response) {
      if (err) throw err
      console.log(response)
    })
  }
}
