require('crontab').load(function (err, crontab) {
  if (err) throw err

  // prevent duplicates
  crontab.remove({command: 'remind agent'})
  crontab.remove({command: 'say hello'})

  // run the agent every minute
  crontab.create('say hello', '* * * * *')
  crontab.create('remind agent', '* * * * *')

  crontab.save(function (err, crontab) {
    if (err) throw err

    console.log('Success! Created a cron job to check for reminders every minute\n')
    console.log("Run `crontab -l` to make sure it's in there.")
    console.log('Run `crontab -e` to remove it.\n\n')
  })
})
