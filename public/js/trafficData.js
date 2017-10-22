var att = {};

att.auth = {
  method: 'GET',
  url: 'https://890407d7-e617-4d70-985f-01792d693387.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token?grant_type=client_credentials',
  headers: {
    'Authorization': 'Basic aGFja2F0aG9uOkBoYWNrYXRob24='
  },
  data: {
    'grant_type': 'client_credentials'
  },
  error: function(err){
    console.log(err);
  },
  async: false
}

att.traffic = {
  method: 'GET',
  url: 'https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2/locations/',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-TRAFFIC'
  },
  error: function(err){
    console.log(err);
  },
  async: false
}

att.location = {
  method: 'GET',
  url: 'https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata/locations/search',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-TRAFFIC'
  },
  error: function(err){
    console.log(err);
  },
  async: false
}

att.cachedLocations = {};

att.getData = function(bbox, start, end){
  //auth
  att.auth.success = function(data){
    att.traffic.headers.Authorization = data.token_type+' '+data.access_token;
    att.location.headers.Authorization = data.token_type+' '+data.access_token;
  }
  $.ajax(att.auth)

  //locations
  var locparams = {
    q: 'locationType:TRAFFIC_LANE',
    bbox: bbox,
    size: 400,
    startTime: start,
    endTime: end
  }
  att.location.data = locparams;
  var locations = [];
  att.location.success = function(data){
    locations = data.content;
    locations.forEach((location)=>{
      var str = location.coordinates;
      var spl = str.split(',');
      var one = spl[0].split(':');
      var two = spl[1].split(':');
      att.cachedLocations[location.locationUid] = {
        lat: (parseFloat(one[0])+parseFloat(one[0]))/2,
        lng: (parseFloat(one[1])+parseFloat(two[1]))/2
      };
    })
  }
  $.ajax(att.location);

  //traffic
  var params = {
    eventType: 'TFEVT',
    startTime: start,
    endTime: end
  };
  att.traffic.data=params;
  var trafficEvents = [];
  locations.forEach((location)=>{
    var temp = att.traffic.url;
    att.traffic.url+=location.locationUid+'/events';
    att.traffic.success = function(events){
      console.log(events.content.length)
      events.content.forEach((event)=>{
        trafficEvents.push({
          location: event.locationUid,
          coords: att.cachedLocations[event.locationUid],
          time: event.timestamp,
          measures: event.measures
        });
      })
      console.log(trafficEvents.length)
    }
    $.ajax(att.traffic);
    att.traffic.url = temp;
  })
  /*
  att.traffic.success = function(events){
    console.log(events)
    events.content.forEach(function(event){
      if(!att.cachedLocations[event.locationUid]){
        var temp = att.location.url;
        att.location.url+=event.locationUid;
        var coords = [];
        att.location.success = function(data){
          var str = data.coordinates
          var spl = str.split(',');
          var one = spl[0].split(':');
          var two = spl[1].split(':');
          coords.push({
            lat: parseFloat(one[0]),
            lng: parseFloat(one[1])
          });
          coords.push({
            lat: parseFloat(two[0]),
            lng: parseFloat(two[1])
          });
        }
        $.ajax(att.location);
        att.location.url=temp;
        att.cachedLocations[event.locationUid]=coords;
      }
      trafficEvents.push({
        location: event.locationUid,
        coords: att.cachedLocations[event.locationUid],
        time: event.timestamp,
        measures: event.measures
      })
    })
  }
  $.ajax(att.traffic)*/
  trafficEvents.sort(function(a,b){
    return a.time-b.time
  });
  return trafficEvents;
}

function paramsToString(params){
  var ret = '?';
  Object.keys(params).forEach(function(key){
    if(ret.length!=1)ret+='&';
    ret+=key+'='+params[key];
  })
  return ret;
}