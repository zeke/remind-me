module.exports = function (task, config) {
  if (
    config &&
    config.enabled &&
    config.accountSID &&
    config.authToken &&
    config.fromPhoneNumber &&
    config.toPhoneNumber
  ) {
    var twilio = require('twilio')(config.accountSID, config.authToken)
    console.log("twilllllio!!")
    twilio.sendMessage({
      to: config.toPhoneNumber,
      from: config.fromPhoneNumber,
      body: task
    }, function (err, response) {
      if (err) throw err
      console.log(response)
    })
  }
}
