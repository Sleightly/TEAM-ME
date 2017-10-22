var map = null;
function initMap() {
	var options = {
		zoom:13,
		center: {lat:32.7157, lng:-117.1611},
		styles:styles
	}
	map = new google.maps.Map(document.getElementById('map'), options);

	google.maps.event.addListener(map, 'click',
		function(event){
			addMarker({latLng:event.latLng});
		});


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
	if (storage[locationUiD]) {
		updateMarker(locationUiD, speed, vol);
		return;
	}
	var id = {};
	var bar = {};
	switch(type) {
		case "car":
			id.url = "/images/4wheel.png"
			id.scaledSize = new google.maps.Size(25, 25);
			id.origin = new google.maps.Point(0,0);
			id.anchor = new google.maps.Point(17,26);
			bar.origin = new google.maps.Point(0,0);
			bar.anchor = new google.maps.Point(5,vol*2);
			break;
		case "human":
			id.url = "/images/human.png"
			id.scaledSize = new google.maps.Size(20, 20);
			id.origin = new google.maps.Point(0,0);
			id.anchor = new google.maps.Point(15,20);
			bar.origin = new google.maps.Point(0,0);
			bar.anchor = new google.maps.Point(5,vol*2);
			break;
	}


	var newSpeed = Math.floor(speed/4);
	if (newSpeed > 15)newSpeed = 15;
	bar.url = '/images/speed'+(15-newSpeed)+'.svg';

	vol = Math.floor(vol/3*5);
	bar.scaledSize = new google.maps.Size(10, vol);

	if (type == "human") {
		vol = Math.floor(vol/2);
		if (vol > 15)vol = 15;
		bar.url = '/images/speed'+vol+'.svg';
	}

	var line = {
		url: '/images/line.svg',
		scaledSize: new google.maps.Size(4, 12),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(4,8),
	}

	var barMarker = new google.maps.Marker({
		position:coords,
		icon: bar,
		map: map,
		//content: ""
		zIndex: 0
	});

	var idMarker = new google.maps.Marker({
		position:coords,
		icon: id,
		map: map,
		zIndex: 10
	});

	var lineMarker = new google.maps.Marker({
		position:coords,
		icon: line,
		map: map,
		zIndex: 20
	});

	var inforWindow = new google.maps.InfoWindow({
		content:barMarker.content
	});

	barMarker.addListener('click', function() {
		inforWindow.open(map, marker);
	});


	storage[locationUiD] = {
		coords: coords,
		type: type,
		id: idMarker,
		bar: barMarker,
		line: lineMarker
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
	var coords = storage[locationUiD].coords;
	var type = storage[locationUiD].type;
	//remove marker
	storage[locationUiD].bar.setMap(null);
	//add new marker
	var bar = {};
	switch(type) {
		case "car":
			bar.origin = new google.maps.Point(0,0);
			bar.anchor = new google.maps.Point(5,vol*2);
			break;
		case "human":
			bar.origin = new google.maps.Point(0,0);
			bar.anchor = new google.maps.Point(5,vol*2);
			break;
	}

	var newSpeed = Math.floor(speed/4);
	if (newSpeed > 15)newSpeed = 15;
	bar.url = '/images/speed'+(15-newSpeed)+'.svg';

	vol = Math.floor(vol/3*5);
	bar.scaledSize = new google.maps.Size(10, vol);

	if (type == "human") {
		vol = Math.floor(vol/2);
		if (vol > 15)vol = 15;
		bar.url = '/images/speed'+vol+'.svg';
	}

	var barMarker = new google.maps.Marker({
		position:coords,
		icon: bar,
		map: map,
		//content: ""
		zIndex: 0
	});
	storage[locationUiD].bar = barMarker;
}

var showCars = function(show) {
	var carmap = null;
	if(show)carmap = map;
	Object.keys(storage).forEach(function(key) {
		if (storage[key].type = 'car') {
			storage[key].bar.setMap(carmap);
			storage[key].id.setMap(carmap);
			storage[key].line.setMap(carmap);
		}
	});
}

var showHuman = function(show) {
	var hmap = null;
	if(show)hmap = map;
	Object.keys(storage).forEach(function(key) {
		if (storage[key].type = 'human') {
			storage[key].bar.setMap(hmap);
			storage[key].id.setMap(hmap);
			storage[key].line.setMap(hmap);
		}
	});
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