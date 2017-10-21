function initMap() {
		var options = {
			zoom:13,
			center: {lat:32.7157, lng:-117.1611}
		}
		var map = new google.maps.Map(document.getElementById('map'), options);

		google.maps.event.addListener(map, 'click',
			function(event){
				addMarker({latLng:event.latLng});
			});

		/*var startTime;
		var endTime;

		for (var i = 0; i < input.length; i++) {
			if (input[i].)
		}*/

		var markers = [
			{
				latLng:{lat:32.7353, lng:-117.1490},
				icon:'',
				content:'<h1>SD Zoo</h1>'
			}
		];

		for(var i = 0; i < markers.length; i++) {
			addMarker(markers[i]);
		}

		//add multiple marker function
		function addMarker(props) {
			var marker = new google.maps.Marker({
				position: props.latLng,
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
		}
	}

