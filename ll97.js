mapboxgl.accessToken = 'pk.eyJ1IjoiYm1hbmNlbGwiLCJhIjoiY2oxZ24yd3E2MDAzdDJ3cG1jenB2dTl3cSJ9.38jhDPw4NnOpKK2mMmF_xQ';

hideshowDesktop=document.querySelector(".infoHideShow [class*='fa']");
hideshowDesktop.addEventListener("click", (e) => {
			if (e.target.classList.contains("fa-chevron-up")	)  {
					e.target.classList.replace("fa-chevron-up","fa-chevron-down");				
					document.querySelector(".desktopDescription-overlay").style.height="40px";
					document.querySelector(".infoContent").style.display="none";
					document.querySelector("[class*='fa-chevron']").title="Show"	;				
			} else {
					document.querySelector(".infoContent").style.display="block";
					document.querySelector(".desktopDescription-overlay").style.height="700px";					
					e.target.classList.replace("fa-chevron-down","fa-chevron-up");					
					document.querySelector("[class*='fa-chevron']").title="Collapse"	;									
			}
			/*
			e.target.animate( 
						   [	
								{ transform: 'translateY(0px)' }, 				
								{ transform: 'rotate(90deg)'}
							]		 ,
							500
					)
			*/
	}	
);


showMobileInfo=document.querySelector(".mobileDescription-overlay .row");
showMobileInfo.addEventListener("click", (e) => {	
	document.querySelector(".mobileContent").style.display="block";
	document.querySelector(".mobileContent").scrollIntoView( {
		behavior: "smooth", 
		block: "start", 
		inline: "start"
	});
	//document.querySelector(".map-overlay").style.display="none";
});


hideMobileInfo=document.querySelector(".mobileContent .fa");
hideMobileInfo.addEventListener("click", (e) => {
	//document.querySelector(".map-overlay").style.display="block";	
	document.querySelector(".mobileContent").style.display="none";
	window.scrollTo(0,0);
})


	

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-73.973136,40.731069],
    zoom: 12
});

var clickStateId = null;

map.on('load', function () {
	map.addSource('bldgSource2', {
		'type': 'geojson',
		'data': 'data/LL97_MapPLUTO_excludingExemptions3_6_WGS.json',
		'generateId': true
	})

	map.addLayer({
		'id': 'bldg-layer2',
		'source': 'bldgSource2',
		'type': 'fill',
		"paint": {
			'fill-opacity': 0.2,
			'fill-color': ["case",
				["boolean", ["feature-state", "click"], false],
				'#0df7ff',
				'#fcf403'
				]			
		}	
	})
	map.on("click", "bldg-layer2", function(e) {
		if (e.features.length > 0) {
		console.log(e.features[0])
			if (clickStateId) {
				map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
			}
			clickStateId = e.features[0].id;
			map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: true});
		}
		console.log('clickStateId = ',clickStateId)
	});
	
});


map.on('click', function(e) {

  var lots_geojson = map.queryRenderedFeatures(e.point, {
    layers: ['bldg-layer2']
  });
	if (lots_geojson.length > 0) {
		
		document.getElementById('pd').innerHTML = 
		'<p>'+'BBL: ' +lots_geojson[0].properties.BBL +	'</p>' +
		'<p>'+'Borough: ' +lots_geojson[0].properties.Boro_1 +'</p>' + 
		'<p>'+'Block: ' +lots_geojson[0].properties.Block_1 + 
		'<p>'+'Lot: ' +lots_geojson[0].properties.Lot_1 +'</p>' +'</p>' +
		'<p>'+'Address: ' +lots_geojson[0].properties.Address + '</p>' +
		'<p>'+'Owner: ' + lots_geojson[0].properties.OwnerName +'</p>' +
		'<p>'+'Number of Buildings: ' +lots_geojson[0].properties.NumBldgs + '</p>'	+ 
		'<p>'+'Gross Square Footage: ' +lots_geojson[0].properties.GrossSquar + '</p>' + 
		'<p>'+'Building Class: ' +lots_geojson[0].properties.BC + '</p>' + 
		'<p>'+'Tax Class: ' +lots_geojson[0].properties.TaxClass + '</p>';
	  } else {
		document.getElementById('pd').innerHTML = '<p>Click on a lot for details...</p>';
		map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
  }
});


//Change the cursor to a pointer when the mouse is over the lots layer.
map.on('mouseenter', 'LL97_Lots', function () {
map.getCanvas().style.cursor = 'pointer';
});

//Change the cursor to a pointer when the mouse is over the lots geojson layer.
map.on('mouseenter', 'bldg-layer2', function () {
map.getCanvas().style.cursor = 'pointer';
});
 
//Change it back to a pointer when it leaves.
map.on('mouseleave', 'bldg-layer2', function () {
map.getCanvas().style.cursor = '';
});



var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
});
 
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
