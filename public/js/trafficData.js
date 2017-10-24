var att = {};

att.auth = {
  method: 'GET',
  url: 'https://890407d7-e617-4d70-985f-01792d693387.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
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
  try{
    var t = window;
    t = true;
  }catch(e){
    t = false;
  }
  if(t){
    console.log("Error: Don't request data in the main thread you dummy.  Please use the worker thread.");
    return;
  }
  //auth
  att.auth.success = function(data){
    att.traffic.headers.Authorization = data.token_type+' '+data.access_token;
    att.location.headers.Authorization = data.token_type+' '+data.access_token;
    att.ped.headers.Authorization = data.token_type+' '+data.access_token;
    att.pedLocation.headers.Authorization = data.token_type+' '+data.access_token;
  }
  ajax(att.auth)
  
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
  ajax(att.location);

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
  ajax(att.pedLocation);

  var total = (locations.length+pedLocations.length)/100;
  var counter = 0;

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
    ajax(att.traffic);
    att.traffic.url = temp;
    counter++;
    postMessage({percentage: Math.floor(counter/total*10)/10});
  })

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
    ajax(att.ped);
    att.ped.url = temp;
    counter++;
    postMessage({percentage: Math.floor(counter/total*10)/10});
  })

  console.log('simmed')
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

function ajax(p){
  var url = p.url+paramsToString(p.data);
  var options = {
    url: url,
    method: p.method,
    headers: p.headers
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/data', p.async);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      p.success(JSON.parse(xhr.responseText));
    }else if(xhr.status !== 200) {
      p.error(JSON.parse(xhr.responseText));
      postMessage({error: ":("});
    }
  }
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(options));
}

onmessage = function(e) {
  postMessage({percentage: 0});
  var events = att.getData(e.data.bbox, e.data.start, e.data.end);
  postMessage({events});
}