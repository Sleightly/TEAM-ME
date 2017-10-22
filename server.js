var EXS = require('./lib/expressServer');
    //ATT = require('./lib/attData');

var MessagingResponse = require('twilio').twiml.MessagingResponse;
EXS.app.post('/sms', (req, res) => {
const twiml = new MessagingResponse();
  if (!simRunnning) {
  	twiml.message('Sorry, no simmulation running currently!');
  	res.writeHead(200, {'Content-Type': 'text/xml'});
  	res.end(twiml.toString());
  }
  var str = req.body.Body;
  var keyword1 = "traffic";
  var keyword2 = "pedestrian";






  twiml.message('what up');
  console.log("text received");

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

var simRunnning = false;
var currentPhone = "";

EXS.app.get('/demoStart', (req, res) => {
	simRunnning = true;
});

EXS.app.get('/demoEnd', (req, res) => {
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

/*
	given time - find the red spots - return coords (traffic)
							-google geoencoding api

	free parking spots

	pedestrian major crossing 


	

*/