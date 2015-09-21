const open = require('open')
const issueURL = require('gh-issue-url')({user: 'zeke', repo: 'remind-me'})
const pkg = require('../package.json')

module.exports = function(reminder) {

  // Don't open these URLs when the test suite is running
  if (process.env.NODE_ENV === 'test') return

  open(issueURL({
    title: `unrecognized pattern: ${reminder.input}`,
    body: `
I tried to create a reminder, but the parser doesn't understand it:

\`\`\`
${reminder.input}
\`\`\`

I'm using remind-me version ${pkg.version}

:v:
`}))

}
