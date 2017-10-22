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

att.ped = {
  method: 'GET',
  url: 'https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2/locations/',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-PEDESTRIAN'
  },
  error: function(err){
    console.log(err);
  },
  async: false
}

att.pedLocation = {
  method: 'GET',
  url: 'https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata/locations/search',
  headers: {
    'Predix-Zone-Id': 'SDSIM-IE-PEDESTRIAN'
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
    att.ped.headers.Authorization = data.token_type+' '+data.access_token;
    att.pedLocation.headers.Authorization = data.token_type+' '+data.access_token;
  }
  $.ajax(att.auth)
  
  var trafficEvents = [];

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
  locations.forEach((location)=>{
    var temp = att.traffic.url;
    att.traffic.url+=location.locationUid+'/events';
    att.traffic.success = function(events){
      console.log(events.content.length)
      events.content.forEach((event)=>{
        trafficEvents.push({
          location: event.locationUid,
          coords: att.cachedLocations[event.locationUid],
          type: 'car',
          time: event.timestamp,
          measures: event.measures
        });
      })
      console.log(trafficEvents.length)
    }
    $.ajax(att.traffic);
    att.traffic.url = temp;
  })

  //pedlocation
  var pedlocparams = {
    q: 'locationType:WALKWAY',
    bbox: bbox,
    size: 400,
    startTime: start,
    endTime: end
  }
  att.pedLocation.data = pedlocparams;
  var pedLocations = [];
  att.pedLocation.success = function(data){
    pedLocations = data.content;
    pedLocations.forEach((location)=>{
      var str = location.coordinates;
      var spl = str.split(',');
      var one = spl[0].split(':');
      att.cachedLocations[location.locationUid] = {
        lat: parseFloat(one[0]),
        lng: parseFloat(one[1])
      };
    })
  }
  $.ajax(att.pedLocation);

  //pedestrian
  var params = {
    eventType: 'PEDEVT',
    startTime: start,
    endTime: end
  };
  att.ped.data=params;
  pedLocations.forEach((location)=>{
    var temp = att.ped.url;
    att.ped.url+=location.locationUid+'/events';
    att.ped.success = function(events){
      console.log(events.content.length)
      events.content.forEach((event)=>{
        trafficEvents.push({
          location: event.locationUid,
          coords: att.cachedLocations[event.locationUid],
          type: 'human',
          time: event.timestamp,
          measures: event.measures
        });
      })
      console.log(trafficEvents.length)
    }
    $.ajax(att.ped);
    att.ped.url = temp;
  })


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