'use strict'
const LogDraft = require('./LogDraft')
const LineCountStream = require('./LineCountStream')

/*
 * Injects DrafLog into a console object
 * call with a seccond parameter as 'true' to 
 * Mock instalation, and add only the `draft` method
 * as a alias to `console.log`
 */
module.exports = function into(console, production) {
  production = production || false

  // If production mode
  if (production) {
    // Mock draft and set is as console.log
    console.draft = function draft() {
      return console.log.bind(console)
    }
    return
  }

  // Transform stdout from console to LineCounter
  console._stdout = new LineCountStream(console._stdout)

  // Add "draft" to console
  console.draft = function draft() {
    // Create Draft at this point in time
    var logDraft = new LogDraft(console, 'log')

    // Log first
    logDraft.write.apply(logDraft, arguments)

    // Return update function
    return logDraft.update.bind(logDraft)
  }
}