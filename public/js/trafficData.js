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
  async: false
}

att.traffic = {
  method: 'GET',
  url: 'https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2/locations/events',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-TRAFFIC'
  },
  async: false
}

att.location = {
  method: 'GET',
  url: 'https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata/locations/',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-TRAFFIC'
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
  //traffic
  var params = {
    bbox: bbox,
    eventType: 'TFEVT',
    locationType: 'TRAFFIC_LANE',
    startTime: start,
    endTime: end
  };
  att.traffic.data=params;
  var trafficEvents = [];
  att.traffic.success = function(events){
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
  $.ajax(att.traffic)
  trafficEvents.sort(function(a,b){
    return b.time-a.time
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