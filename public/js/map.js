var map = null;
function initMap() {
	var options = {
		zoom:16,
		center: {lat:32.7157, lng:-117.1611},
		styles:styles
	}
	map = new google.maps.Map(document.getElementById('map'), options);

	/*google.maps.event.addListener(map, 'click',
		function(event){
			addMarker({latLng:event.latLng});
		});*/


/*	var markers = [
		{
			latLng:{lat:32.7353, lng:-117.1490},
			icon: ped,
			content:'<h1>SD Zoo</h1>'
		}
	];

	for(var i = 0; i < markers.length; i++) {
		addMarker(markers[i]);
	}

	//add multiple marker function*/
}

var storage = {};
var makeMarker = function(locationUiD, coords, type, speed, vol) {
	var lane = locationUiD[locationUiD.length-1];
	lane = parseInt(lane);
	var locationID = locationUiD.substring(0, locationUiD.length-1);
	if (storage[locationID]) {
		updateMarker(locationUiD, speed, vol);
		return;
	}
	if (storage[locationUiD]) {
		updateMarker(locationUiD, speed, vol);
		return;
	}
	var id = {};
	var bar = {};
	var bar1 = {};
	var bar2 = {};
	var bar3 = {};
	var bar4 = {};
	switch(type) {
		case "car":
			id.url = "/images/4wheel.png"
			id.scaledSize = new google.maps.Size(25, 25);
			id.origin = new google.maps.Point(0,0);
			id.anchor = new google.maps.Point(17,26);
		
			bar1.origin = new google.maps.Point(0,0);
			bar1.anchor = new google.maps.Point(21,0);
			
			bar2.origin = new google.maps.Point(0,0);
			bar2.anchor = new google.maps.Point(11,0);
		
		
			bar3.origin = new google.maps.Point(0,0);
			bar3.anchor = new google.maps.Point(1,0);
		
		
			bar4.origin = new google.maps.Point(0,0);
			bar4.anchor = new google.maps.Point(-9,0);
			break;
			
		case "human":
			id.url = "/images/human.png"
			id.scaledSize = new google.maps.Size(30, 30);
			id.origin = new google.maps.Point(0,0);
			id.anchor = new google.maps.Point(20,30);
			bar.origin = new google.maps.Point(0,0);
			bar.anchor = new google.maps.Point(6,0);
			break;
	}


	var newSpeed = Math.floor(speed/4);
	if (newSpeed > 15)newSpeed = 15;
	bar1.url = '/images/speed'+(15-newSpeed)+'.svg';
	bar2.url = '/images/speed'+(15-newSpeed)+'.svg';
	bar3.url = '/images/speed'+(15-newSpeed)+'.svg';
	bar4.url = '/images/speed'+(15-newSpeed)+'.svg';
	var speed1 = 0;
	var speed2 = 0;
	var speed3 = 0;
	var speed4 = 0;
	switch (lane) {
		case 1:
			bar1.url = '/images/speed'+(15-newSpeed)+'.svg';
			speed1 = speed;
			break;
		case 2:
			bar2.url = '/images/speed'+(15-newSpeed)+'.svg';
			speed2 = speed;
			break;
		case 3:
			bar3.url = '/images/speed'+(15-newSpeed)+'.svg';
			speed3 = speed;
			break;
		case 4:
			bar4.url = '/images/speed'+(15-newSpeed)+'.svg';
			speed4 = speed;
			break;
	}
	if (type == "human") {
		var newSpeed = Math.floor(speed*4);
		if (newSpeed > 15)newSpeed = 15;
		bar.url = '/images/speed'+(15-newSpeed)+'.svg';
	}


	var vol1 = 0;
	var vol2 = 0;
	var vol3 = 0;
	var vol4 = 0;

	newVol = Math.floor(vol/3*5);
	
	bar1.scaledSize = new google.maps.Size(10, 1);
	bar2.scaledSize = new google.maps.Size(10, 1);
	bar3.scaledSize = new google.maps.Size(10, 1);
	bar4.scaledSize = new google.maps.Size(10, 1);
	if (newVol == 0) {
		newVol = 2;
	}
	switch (lane) {
		case 1:
			bar1.scaledSize = new google.maps.Size(10, newVol);
			vol1 = vol;
			break;
		case 2:
			bar2.scaledSize = new google.maps.Size(10, newVol);
			vol2 = vol;
			break;
		case 3:
			bar3.scaledSize = new google.maps.Size(10, newVol);
			vol3 = vol;
			break;
		case 4:
			bar4.scaledSize = new google.maps.Size(10, newVol);
			vol4 = vol;
			break;
	}
	

	if (type == "human") {
		newSpeed = Math.floor((speed-2)*8);
		if (newSpeed > 15)newSpeed = 15;
		if (newSpeed <= 0)newSpeed = 0;
		bar.url = '/images/speed'+newSpeed+'.svg';

		newVol = Math.floor((vol-200)/5);
		if (newVol <= 0) {
			newVol = 2;
		}
	}
	bar.scaledSize = new google.maps.Size(10, newVol);

	var line = {
		url: '/images/line.svg',
		scaledSize: new google.maps.Size(4, 12),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(4,8),
	}
	//console.log(bar, bar1, bar2, bar3, bar4)

	if (type == "human") {
		var barMarker = new google.maps.Marker({
			position:coords,
			icon: bar,
			map: map,
			zIndex: 0
		});
	}else{
	
		var bar1Marker = new google.maps.Marker({
			position:coords,
			icon: bar1,
			map: map,
			zIndex: 0
		});

		var bar2Marker = new google.maps.Marker({
			position:coords,
			icon: bar2,
			map: map,
			zIndex: 0
		});

		var bar3Marker = new google.maps.Marker({
			position:coords,
			icon: bar3,
			map: map,
			zIndex: 0
		});

		var bar4Marker = new google.maps.Marker({
			position:coords,
			icon: bar4,
			map: map,
			zIndex: 0
		});
	}

	var totalContent = {};
	if (type == "human") {	
		totalContent = '<h1>Total number of ppl: '+vol+'<br>'+
		'Current speed: '+speed+' m/s</h1>'
	}
	else {
		totalContent = '<h1>Total number of cars: '+vol+'<br>'+
		'Current speed: '+speed+'</h1>'
	}

	var idMarker = new google.maps.Marker({
		position:coords,
		icon: id,
		map: map,
		content: totalContent,
		zIndex: 10
	});

	var lineMarker = new google.maps.Marker({
		position:coords,
		icon: line,
		map: map,
		zIndex: 20
	});

	var infoWindow = new google.maps.InfoWindow({
		content:idMarker.content
	});

	idMarker.addListener('click', function() {
		infoWindow.open(map, idMarker);
	});



	if (type == 'car') {
		storage[locationID] = {
			coords: coords,
			type: type,
			id: idMarker,
			bar1: bar1Marker,
			bar2: bar2Marker,
			bar3: bar3Marker,
			bar4: bar4Marker,
			line: lineMarker,
			speed1: speed1,
			speed2: speed2,
			speed3: speed3,
			speed4: speed4,
			vol1: vol1, 
			vol2: vol2,
			vol3: vol3,
			vol4: vol4,
      		infowin: infoWindow
		}
	}else{
    

    storage[locationUiD] = {
      coords: coords,
      type: type,
      id: idMarker,
      bar: barMarker,
      line: lineMarker,
      speed: speed,
      vol: vol,
      infowin: infoWindow
    }
  }

	/*function addMarker(props) {
		var marker = new google.maps.Marker({
			position: props.latLng,
			icon: props.icon,
			map:map
		});

		if (props.icon) {
			marker.setIcon(props.icon);
		} 

		if (props.content) {
			var inforWindow = new google.maps.InfoWindow({
				content:props.content
			});

			marker.addListener('click', function() {
				inforWindow.open(map, marker);
			});
		}
	}*/
}

var updateMarker = function(locationUiD, speed, vol) {
  console.log(speed);
  speed = speed==NaN ? 0 : speed;
	var lane = locationUiD[locationUiD.length-1];
	lane = parseInt(lane);
	var locationID = locationUiD.substring(0, locationUiD.length-1);
	if (lane == 1 || lane == 2 || lane == 3 || lane == 4) {
		var coords = storage[locationID].coords;
		var type = storage[locationID].type;
		var idIcon = storage[locationID].id.icon;
	}
	else {
		var coords = storage[locationUiD].coords;
		var type = storage[locationUiD].type;
		var idIcon = storage[locationUiD].id.icon;
	}
	//remove marker
	if (type == "car") {
		
		var bar = {};
		switch(lane) {
			case 1:
				bar.origin = new google.maps.Point(0,0);
				bar.anchor = new google.maps.Point(21,0);
				storage[locationID].speed1 = speed;
				storage[locationID].vol1 = vol;
				break;
			case 2:
				bar.origin = new google.maps.Point(0,0);
				bar.anchor = new google.maps.Point(11,0);
				storage[locationID].speed2 = speed;
				storage[locationID].vol2 = vol;
				break;
			case 3:
				bar.origin = new google.maps.Point(0,0);
				bar.anchor = new google.maps.Point(1,0);
				storage[locationID].speed3 = speed;
				storage[locationID].vol3 = vol;
				break;
			case 4:
				bar.origin = new google.maps.Point(0,0);
				bar.anchor = new google.maps.Point(-9,0);
				storage[locationID].speed4 = speed;
				storage[locationID].vol4 = vol;
				break;
		}

		var newSpeed = Math.floor(speed/4);
		if (newSpeed > 15)newSpeed = 15;
		bar.url = '/images/speed'+(15-newSpeed)+'.svg';

		newVol = Math.floor(vol/3*5);
		if (newVol == 0) {
			newVol = 2;
		}
		
		bar.scaledSize = new google.maps.Size(10, newVol);

		/*var barMarker = new google.maps.Marker({
			position:coords,
			icon: bar,
			map: map,
			zIndex: 0
		});*/
    storage[locationID]["bar"+lane].setIcon(bar);

		storage[locationID]["speed"+lane] = speed;
		storage[locationID]["vol"+lane] = vol;

		var tVol = (storage[locationID].vol1 + storage[locationID].vol2+ 
		storage[locationID].vol3 + storage[locationID].vol4);

		var tSpeed = Math.floor((storage[locationID].speed1 + storage[locationID].speed2+ 
		storage[locationID].speed3 + storage[locationID].speed4)/4*10)/10;

		/*var idMarker = new google.maps.Marker({
			position:coords,
			icon: idIcon,
			map: map,
			content: '<h1>Total number of cars: '+tVol+'<br>Avg speed: '+tSpeed+' m/s</h1>',
			zIndex: 10
		});*/
    var content = '<h1>Total number of cars: '+tVol+'<br>Current speed: '+tSpeed+' m/s</h1>';
    storage[locationID].infowin.setContent(content);
		//storage[locationID]["bar"+lane].setMap(null);
		//storage[locationID]["bar"+lane] = barMarker;
		//storage[locationID]["id"].setMap(null);
		//storage[locationID]["id"] = idMarker;

		/*var infoWindow = new google.maps.InfoWindow({
			content:idMarker.content
		});*/

		/*idMarker.addListener('click', function() {
			infoWindow.open(map, idMarker);
		});*/

		return;
	}

	//add new marker
	var bar = {
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(6,0)
	}

	var newSpeed = Math.floor((speed-2)*8);
	if (newSpeed > 15)newSpeed = 15;
	if (newSpeed <= 0)newSpeed = 0;
	bar.url = '/images/speed'+(15-newSpeed)+'.svg';

	newVol = Math.floor((vol-200)/5);
	if (newVol <= 0) {
		newVol = 2;
	}
	bar.scaledSize = new google.maps.Size(10, newVol);

	storage[locationUiD]["bar"].setIcon(bar);

	/*var barMarker = new google.maps.Marker({
		position:coords,
		icon: bar,
		map: map,
		zIndex: 0
	});*/
	//storage[locationUiD].bar = barMarker;

	/*var idMarker = new google.maps.Marker({
			position:coords,
			icon: idIcon,
			map: map,
			content: '<h1>Currently being developed</h1>',
			zIndex: 10
		});*/
	var content = '<h1>Total number of people: '+vol+'<br>Current speed: '+speed+' m/s</h1>';
    storage[locationUiD].infowin.setContent(content);
    storage[locationUiD].speed = speed;
    storage[locationUiD].vol = vol;

/*	var infoWindow = new google.maps.InfoWindow({
		content:idMarker.content
	});

	idMarker.addListener('click', function() {
		infoWindow.open(map, idMarker);
	});

	storage[locationUiD].id = idMarker;*/
}

var showCars = function(show) {
	var carmap = null;
	if(show)carmap = map;
	Object.keys(storage).forEach(function(key) {
		if (storage[key].type == 'car') {
      console.log(storage[key])
      storage[key].bar1.setMap(carmap);
      storage[key].bar2.setMap(carmap);
      storage[key].bar3.setMap(carmap);
      storage[key].bar4.setMap(carmap);
			storage[key].id.setMap(carmap);
			storage[key].line.setMap(carmap);
		}
	});
}

var showHuman = function(show) {
	var hmap = null;
	if(show)hmap = map;
	Object.keys(storage).forEach(function(key) {
		if (storage[key].type == 'human') {
			storage[key].bar.setMap(hmap);
			storage[key].id.setMap(hmap);
			storage[key].line.setMap(hmap);
		}
	});
}

var resetSimulation = function () {
	showCars(false);
	showHuman(false);
	storage = {};
}


var styles = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
];