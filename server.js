var EXS = require('./lib/expressServer');
    //ATT = require('./lib/attData');


var simRunning = false;
var currentPhone = "";

var MessagingResponse = require('twilio').twiml.MessagingResponse;
EXS.app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  console.log(simRunning);
  if (!simRunning) {
  	twiml.message('Sorry, no simmulation running currently!');
  	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
  	return;
  }
  var str = req.body.Body;
  var keyword1 = "traffic";
  var keyword2 = "pedestrian";

  var msg = str.split(" ");
  for (var i = 0; i < msg.length; i++) {
  	msg[i] = msg[i].toLowerCase();
  }
  console.log(msg)
  if (msg.indexOf(keyword1) != -1) {
    var msg = simulationTexts[Math.floor(simulationTexts.length/2*Math.random())];
  	twiml.message(msg);
  	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
  }

  else if (msg.indexOf(keyword2) != -1) {
    var msg = simulationTexts[Math.floor(simulationTexts.length/2*Math.random()+simulationTexts.length/2)];
    twiml.message(msg);
  	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
  }
  else {
  	  twiml.message('Text keyword "traffic" or "pedestrian" for updates on local crowded intersections.');
	  res.writeHead(200, {'Content-Type': 'text/xml'});
	  res.end(twiml.toString());
  }

  console.log("Received text!");
});

EXS.app.get('/demoStart', (req, res) => {
  console.log('sim started')
	simRunning = true;
	res.end();
  setTimeout(sendMessage, 5000);
});

EXS.app.get('/demoEnd', (req, res) => {
	res.end()
  simRunning = false;
});

EXS.app.post('/phoneNumber', (req, res) => {
  if(req.body.num){
    currentPhone=req.body.num;
    if(currentPhone[0]!='1')currentPhone='1'+currentPhone;
    console.log(currentPhone)
  }
  res.end();
});

var sendMessage = function() {
  console.log(simRunning, currentPhone)
  if(!simRunning ||currentPhone=="")return;
  var msg = simulationTexts[Math.floor(simulationTexts.length*Math.random())];
  client.messages.create({
      body: msg,
      to: '+'+currentPhone,  // Text this number
      from: '+16193041917' // From a valid Twilio number
  }).then((message) => console.log(message.sid))
  setTimeout(sendMessage, 25000)
}

var config = require('./KeyConfig');

var accountSid = config.Sid; // Your Account SID from www.twilio.com/console
var authToken = config.authToken;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var simulationTexts = [
  "Heavy traffic on E street and 7th avenue.",
  "Light traffic along Broadway and 8th avenue.",
  "Light traffic all along E street.",
  'There is heavy traffic around 8th avenue and F street, and 8th avenue and G street. Recommend taking E Street to 9th Avenue.',
  "Moderate pedestrian crossing at Market and 7th avenue.",
  "Light pedestrian crossing at G street and 9th avenue.",
  "Light pedestrian crossing at F street and 6th.",
  'Heavy pedestrian crossing along 7th avenue and 8th avenue intersecting G street.'
]

/*
	given time - find the red spots - return coords (traffic)
							-google geoencoding api

	free parking spots

	pedestrian major crossing 


	

*/