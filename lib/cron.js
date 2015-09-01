require('crontab').load(function (err, crontab) {

  // prevent duplicates
  crontab.remove({command:'remind agent'})

  // run the agent every minute
  crontab.create('remind agent', '* * * * *')

  crontab.save(function (err, crontab) {
    console.log('Success! Created a cron job to check for reminders every minute\n')
    console.log('Run `crontab -l` to make sure it\'s in there.')
    console.log('Run `crontab -e` to remove it.\n\n')
  })

})
