var http    = require('http'),
    express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    _       = require('underscore'),
    bodyp   = require('body-parser'),
    ws      = require('ws');

exports.app = express();
exports.app.use('/js', express.static(path.join(__dirname, '../public/js')));
exports.app.use('/images', express.static(path.join(__dirname, '../public/images')));
exports.app.use('/css', express.static(path.join(__dirname, '../public/css')));
exports.app.set('views', path.join(__dirname, '../public/views'));
exports.app.use(bodyp.json());
exports.app.use(bodyp.urlencoded({extended:true}));

exports.app.get('/', function(req, res){
  res.render(path.join(__dirname, '../public/views/index.jade'), {gen: generatePack()});
});

exports.app.get('/js/wrld.js', function(req, res){
  //res.sendFile(path.join(__dirname, 'wrld.js/dist/wrld.js'));
});
exports.app.get('/js/jquery.min.js', function(req, res){
  res.sendFile(path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js'));
});
exports.app.get('/js/underscore.min.js', function(req, res){
  res.sendFile(path.join(__dirname, '../node_modules/underscore/underscore-min.js'));
});

exports.server = http.createServer(exports.app);

exports.server.listen(1500);

exports.wss = new ws.Server({server: exports.server, path: '/info'});

exports.wssconns = [];
exports.wss.on('connection', function(client) {
  console.log('ALERT: New Websocket Connection');
  exports.wssconns.push(client);
  client.on('close', function(){
    exports.wssconns.splice(exports.wssconns.indexOf(client), 1);
    console.log("ALERT: Websocket Disconnected");
  })
});

exports.wssconns.write = function(data){
  exports.wssconns.forEach(function(conn){
    conn.write('data');
  })
}

var jqueryfile = 'jquery.min.js';
var underscorefile = 'underscore.min.js';
var jspath = '../public/js';
var generatePack = function() {
  return {
    'keys': function(){
      return "<script>"+loadKeys()+"</script>";
    },
    'mapkey': function(){
      return mapkey();
    },
    'js': function(){
      try{
        exports.js = fs.readdirSync(path.join(__dirname, jspath));
      }catch(err){
        console.log("ERROR: Express Static JS Paths Don't Exist");
      }
      var ret = "";
      //attaching jquery and underscore
      ret += "<script src='"+path.join('js', jqueryfile)+"'type='text/javascript'></script>";
      ret += "<script src='"+path.join('js', underscorefile)+"'type='text/javascript'></script>";
      _.each(exports.js, function(el){
        ret += "<script src='"+path.join('js', el)+"'type='text/javascript'></script>";
      })
      return ret;
    }
  }
}

var loadKeys = function() {
  try{
    delete require.cache[require.resolve('../KeyConfig.json')];
    var config = require('../KeyConfig.json');
  }catch(error){
    console.log("ERROR: No API Key Config Found. ask matt for help");
    var config = {};
    config.Google = process.env.GOOGLE || "";
    config.Map = process.env.MAP || "";
    config.Sid = process.env.SID || "";
    config.authToken = process.env.AUTHTOKEN || "";
  }
  var keys = {
    GoogleKey: config.Google || ""
  }
  var total = ""
  Object.keys(keys).forEach(function(key){
    total+="var "+key+"=\""+keys[key]+"\";"
  });
  return total;
}

var mapkey = function() {
  try{
    delete require.cache[require.resolve('../KeyConfig.json')];
    var config = require('../KeyConfig.json');
  }catch(error){
    console.log("ERROR: No API Key Config Found. ask matt for help");
    config.Google = process.env.GOOGLE || "";
    config.Map = process.env.MAP || "";
    config.Sid = process.env.SID || "";
    config.authToken = process.env.AUTHTOKEN || "";
    var config = {};
  }
  return config.Map || "";
}