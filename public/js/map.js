var map = null;
function initMap() {
	var options = {
		zoom:13,
		center: {lat:32.7157, lng:-117.1611}
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
	var id = {};
	switch(type) {
		case "car":
			id.url = "/images/4wheel.png"
			break;
		case "human":
			id.url = "/images/human.png"
			break;
	}
	id.scaledSize = new google.maps.Size(20, 20);
	id.origin = new google.maps.Point(0,0);
	id.anchor = new google.maps.Point(15,20);

	var bar = {};

	speed = Math.floor(speed/4);
	if (speed > 15)speed = 15;
	bar.url = '/images/speed'+speed+'.png';

	vol = Math.floor(vol/3*5);
	bar.scaledSize = new google.maps.Size(25, vol);

	bar.origin = new google.maps.Point(0,0);
	bar.anchor = new google.maps.Point(15,vol);

	var line = {
		url: '/images/line.png',
		scaledSize: new google.maps.Size(50, 7),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(23, 4)
	}

	var idMarker = new google.maps.Marker({
		position:coords,
		icon: id,
		map: map
	});
	var barMarker = new google.maps.Marker({
		position:coords,
		icon: bar,
		map: map
		//content: ""
	});

	var lineMarker = new google.maps.Marker({
		position:coords,
		icon: line,
		map: map
	});

	var inforWindow = new google.maps.InfoWindow({
		content:barMarker.content
	});

	barMarker.addListener('click', function() {
		inforWindow.open(map, marker);
	});


	storage[locationUiD] = {
		id: idMarker.icon,
		bar: barMarker.icon,
		line: lineMarker.icon
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
	var bar = {};
	switch(speed) {
		case speed < 4:
			bar.url = "/images/speed15.png"
			break;
		case speed < 8:
			bar.url = "/images/speed14.png"
			break;
		case speed < 12:
			bar.url = "/images/speed13.png"
			break;
		case speed < 16:
			bar.url = "/images/speed12.png"
			break;
		case speed < 20:
			bar.url = "/images/speed11.png"
			break;
		case speed < 24:
			bar.url = "/images/speed10.png"
			break;
		case speed < 28:
			bar.url = "/images/speed9.png"
			break;
		case speed < 32:
			bar.url = "/images/speed8.png"
			break;
		case speed < 36:
			bar.url = "/images/speed7.png"
			break;
		case speed < 40:
			bar.url = "/images/speed6.png"
			break;
		case speed < 44:
			bar.url = "/images/speed5.png"
			break;
		case speed < 48:
			bar.url = "/images/speed4.png"
			break;
		case speed < 52:
			bar.url = "/images/speed3.png"
			break;
		case speed < 56:
			bar.url = "/images/speed2.png"
			break;
		case speed < 60:
			bar.url = "/images/speed1.png"
			break;
		case speed > 64:
			bar.url = "/images/speed0.png"
			break;
	}
	switch(vol) {
		case vol < 3:
			bar.scaledSize = new google.maps.Size(20, 5);
			break;
		case vol < 6:
			bar.scaledSize = new google.maps.Size(20, 10);
			break;
		case vol < 9:
			bar.scaledSize = new google.maps.Size(20, 15);
			break;
		case vol < 12:
			bar.scaledSize = new google.maps.Size(20, 20);
			break;
		case vol < 15:
			bar.scaledSize = new google.maps.Size(20, 25);
			break;
		case vol < 16:
			bar.scaledSize = new google.maps.Size(20, 30);
			break;
		case vol < 18:
			bar.scaledSize = new google.maps.Size(20, 35);
			break;
		case vol < 21:
			bar.scaledSize = new google.maps.Size(20, 40);
			break;
		case vol < 24:
			bar.scaledSize = new google.maps.Size(20, 45);
			break;
		case vol < 27:
			bar.scaledSize = new google.maps.Size(20, 50);
			break;
		case vol < 30:
			scaledSize = new google.maps.Size(20, 55);
			break;
		case vol >= 30:
			scaledSize = new google.maps.Size(20, 60);
			break;
	}
	bar.origin = new google.maps.Point(0,0);
	bar.anchor = new google.maps.Point(0,0);
	storage[locationUiD].bar = bar;
}


