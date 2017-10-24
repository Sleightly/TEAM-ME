var https = require('https');

exports.install = function(app){
  app.post('/data', function(req, res){
    req.pause();
    var ajax = req.body;
    //console.log(ajax)
    var url = ajax.url.replace('https://','');
    var splitPoint = url.indexOf('/');
    ajax.host = url.substring(0,splitPoint);
    ajax.path = url.substring(splitPoint);

    var post = https.request(ajax, function(resp){
      var total = "";
      resp.pause();
      res.writeHead(200, {'Content-Type': 'application/json'});
      resp.on('data', function(chunk){
        total+=chunk;
      });
      resp.on('end', function(){
        //console.log(total);
      });
      resp.pipe(res);
      resp.resume();
    }).on('error', function(e){
      console.log("Got error: "+e.message);
      res.writeHead(500);
      res.send('{error:"check server"}')
    });
    post.end();
    req.resume();
  })
}