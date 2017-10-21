var twilio = require('twilio');

var accountSid = 'ACb1ecc1de73e13ed5ab25e9831e770061'; // Your Account SID from www.twilio.com/console
var authToken = '0376bf4e5c16c6791a80fc1652aff24f';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello Matt, I sending this from my code :D wooot lets win this weekend :)',
    to: '+14088345276',  // Text this number
    from: '+16193041917' // From a valid Twilio number
})
.then((message) => console.log(message.sid));