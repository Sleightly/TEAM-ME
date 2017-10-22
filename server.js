var EXS = require('./lib/expressServer');
    //ATT = require('./lib/attData');

var MessagingResponse = require('twilio').twiml.MessagingResponse;
EXS.app.post('/sms', (req, res) => {
 
  var str = req.body.Body;
  
  

  
  const twiml = new MessagingResponse();

  twiml.message('what up');
  console.log("text received");

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

/*
	given time - find the red spots - return coords (traffic)
							-google geoencoding api

	free parking spots

	pedestrian major crossing 


	

*/