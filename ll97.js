mapboxgl.accessToken = 'pk.eyJ1IjoiYm1hbmNlbGwiLCJhIjoiY2oxZ24yd3E2MDAzdDJ3cG1jenB2dTl3cSJ9.38jhDPw4NnOpKK2mMmF_xQ';
hideshowDesktop=document.querySelector("[class*='fa-chevron']");
hideshowDesktop.addEventListener("click", (e) => {
			if (e.target.classList.contains("fa-chevron-up")	)  {
					e.target.classList.replace("fa-chevron-up","fa-chevron-down");				
					document.querySelector(".desktopDescFloat").style.height="40px";
					document.querySelector(".infoContent").style.display="none";
					document.querySelector("[class*='fa-chevron']").title="Show"	;				
			} else {
					document.querySelector(".infoContent").style.display="block";
					document.querySelector(".desktopDescFloat").style.height="700px";					
					e.target.classList.replace("fa-chevron-down","fa-chevron-up");					
					document.querySelector("[class*='fa-chevron']").title="Collapse";
			}
});
showMobileInfo=document.querySelector(".mobileDescFloat");
	showMobileInfo.addEventListener("click",(e) =>{
			(document.querySelector(".infoContentR")) ? document.querySelector(".infoContentR").remove():true;
			cc= document.querySelector(".infoContent").cloneNode(true);
			cc.classList.replace("infoContent","infoContentR");
			cc.style.display="block";
			document.querySelector(".mobileDescHeader").appendChild(cc)
			document.querySelector(".mobileDescHeader").style.display="flex";
			document.querySelector(".infoContent").style.display="block";
			document.querySelector(".mobileDescHeader").scrollIntoView( {
			behavior: "smooth",block: "start",inline: "start"});
});
mapButtonDiv = document.querySelector(".mapButtonDiv");
mapButtonDiv.addEventListener("click", (e) => {	
if (e.target.nodeName=="SPAN"){	
	document.querySelector('#lotdetails').innerHTML = ""	
	for (let i = 0, c = e.currentTarget.children; i < c.length; i++) {
		let vLLAttrib= c[i].attributes["data-ll"].value  ;		
		if (e.target == c[i] ) {
				c[i].classList.add("selectedLL");
				map.setLayoutProperty(vLLAttrib,"visibility","visible")	
				document.querySelector(".map-overlay h6").innerHTML = " LOCAL LAW " +  vLLAttrib   + " ELIGIBLE LOTS";				
				map.removeFeatureState({source: "bldgSource2"})								
				document.querySelector(".ll"+vLLAttrib).style.display="block";
					document.querySelectorAll(".llnumspan").forEach((item)=>{item.innerHTML=document.querySelector(".selectedLL").getAttribute("data-ll");})
		} else {
				c[i].classList.remove("selectedLL");
				map.setLayoutProperty(vLLAttrib,"visibility","none");
				document.querySelector(".ll"+vLLAttrib).style.display="none";				
}}}});


hideMobileInfo=document.querySelector(".fa-times-circle");
hideMobileInfo.addEventListener("click", (e) => {
	(document.querySelector(".infoContentR")) ? document.querySelector(".infoContentR").remove()  : true ;
	document.querySelector(".mobileDescHeader").style.display="none";
	window.scrollTo(0,0);
});


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-73.973136,40.731069],
    zoom: 12
});
var clickStateId = null;
let vBBL1=new Promise((resolve,reject) => {
	//let arrBBL2=[];
	let arrBBL=[];
	//vStatus=false;
	$.get('data/bbldata1.csv', function (bbldata) {	
		arrBBL = bbldata.split('\n').map(function(item) {
			return parseInt(item);
		});
		(isNaN(arrBBL[0])) ? arrBBL.shift():true;  
				if (arrBBL.length > 0 ) {
					resolve(arrBBL)
				} else {
					reject("NO BBL DATA FOR 1 OR MORE LOCAL LAWS");
				}
	})		
}); 
	
	
let vBBL2=new Promise((resolve,reject) => {
	//let arrBBL2=[];
	let arrBBL=[];
	//vStatus=false;
	$.get('data/bbldata2.csv', function (bbldata) {	
		arrBBL = bbldata.split('\n').map(function(item) {
			return parseInt(item);
		});
		(isNaN(arrBBL[0])) ? arrBBL.shift():true;  
				if (arrBBL.length > 0 ) {
					resolve(arrBBL)
				} else {
					reject("NO BBL DATA FOR 1 OR MORE LOCAL LAWS");
				}
	})		
}); 

let vBBL3=new Promise((resolve,reject) => {
	let arrBBL=[];
	$.get('data/bbldata3.csv', function (bbldata) {	
		arrBBL = bbldata.split('\n').map(function(item) {
			return parseInt(item);
		});
		(isNaN(arrBBL[0])) ? arrBBL.shift():true;  
				if (arrBBL.length > 0 ) {
					resolve(arrBBL)
				} else {
					reject("NO BBL DATA FOR 1 OR MORE LOCAL LAWS");
				}
	})		
}); 

let vLocalLawPromise = new Promise( function(resolve,reject) {
			let infocontent = 'data/locallaws.json';
			let rq = new XMLHttpRequest();
			rq.open('GET', infocontent);
			rq.responseType = 'json';
			rq.send();
			rq.onload = function() {
					  let locallaws = rq.response;
					  if ( locallaws[0] ) {
							for (let x=locallaws.length-1 ; x > -1;x--) {
									cc= document.querySelector(".shell").cloneNode(true);
									cc.classList.replace("shell","ll"+locallaws[x].name);
									document.querySelectorAll(".llnumspan").forEach( 
										(item) =>{item.innerHTML = locallaws[x].name;})									
									document.querySelector(".infoContent").appendChild(cc)
									document.querySelector(".ll" + locallaws[x].name + " .lead em").innerHTML=locallaws[x].desc ;
									document.querySelector(".ll" + locallaws[x].name + " #who p").innerHTML=locallaws[x].who ;
									for (let ctr=0,t=locallaws[x].exceptions.length;ctr<t;ctr++) {
										let el=document.createElement("li");
										let elcontent=document.createTextNode(locallaws[x].exceptions[ctr].description);
										el.appendChild(elcontent);
										document.querySelector(".ll" + locallaws[x].name + " #exceptions ol").appendChild(el);
									}
									if ( document.querySelector(".selectedLL").getAttribute("data-ll") == locallaws[x].name  )  {
										document.querySelector(".ll" + locallaws[x].name).style.display="block";										
									}
								}
							document.querySelectorAll(".aboutHead .llnumspan").forEach( (item)=>
									{item.innerHTML=document.querySelector(".selectedLL").getAttribute("data-ll");} 
							)
							resolve("FOUND A LOCAL LAW");
						} else {
							reject("NO LOCAL LAW DESCRIPTIONS FOUND");
						}
}});
let vAllBBL = Promise.all([vBBL1, vBBL2, vBBL3, vLocalLawPromise]);	
vAllBBL
	.then((filterArray) => {//when bbl lookup data exists
				map.on('load', function () {
					map.addSource('bldgSource2', {
						'type': 'geojson',
						'data': 'data/LL97_MapPLUTO_excludingExemptions3_6_WGS.json',
						'generateId': true
					})
					var filterBBL1 = ['match',['get', 'BBL'],filterArray[0],true,false];	
					var filterBBL2 = ['match',['get', 'BBL'],filterArray[1],true,false];	
					var filterBBL3 = ['match',['get', 'BBL'],filterArray[2],true,false];	
					map.addLayer({
						'id': '97',
						'source': 'bldgSource2',
						'type': 'fill',
						"paint": {
							'fill-opacity': .2,
							'fill-color': ["case",
								["boolean", ["feature-state", "click"], false],
								'#0df7ff',
								'#fcf403'
								]
						},
						"filter": filterBBL1
					});					
					map.addLayer({
						'id': '92',
						'source': 'bldgSource2',
						'type': 'fill',
						"paint": {
							'fill-opacity': 0.2,
							'fill-color': ["case",
								["boolean", ["feature-state", "click"], false],
								'#0df7ff',
								'#fcf403'
								]
						},
						"filter": filterBBL2
					});
					map.addLayer({
						'id': '94',
						'source': 'bldgSource2',
						'type': 'fill',
						"paint": {
							'fill-opacity': 0.2,
							'fill-color': ["case",
								["boolean", ["feature-state", "click"], false],
								'#0df7ff',
								'#fcf403'
								]
						},
						"filter": filterBBL3
					});					
					map.on("click", "97", function(e) {
						if (e.features.length > 0) {
							//console.log(e.features[0])
							if (clickStateId) {
								map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
							}
							clickStateId = e.features[0].id;
							map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: true});
						}
						console.log('clickStateId = ',clickStateId);
					});					
					map.on("click", "92", function(e) {
						if (e.features.length > 0) {
							//console.log(e.features[0])
							if (clickStateId) {
								map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
							}
							clickStateId = e.features[0].id;
							map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: true});
						}
						console.log('clickStateId = ',clickStateId);
					});					
					map.on("click", "94", function(e) {
						if (e.features.length > 0) {
							if (clickStateId) {
								map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
							}
							clickStateId = e.features[0].id;
							map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: true});
						}
					});	
					document.querySelectorAll(".switchLocalLawShown").forEach(
						(el) => {
							let qt=el.getAttribute("data-ll");
							if ( el.classList.contains("selectedLL") ) {
								map.setLayoutProperty(qt,'visibility','visible');
							} else {
								map.setLayoutProperty(qt,'visibility','none');
							}
						}
					)
				});				
	})
	.catch ((error)=>{ console.log(error)});
	
map.on('click', function(e) {
  var lots_geojson = map.queryRenderedFeatures(e.point, {
    //layers: ['97']
    layers: ['97','94', '92']
  });
	if (lots_geojson.length > 0) {		
		document.getElementById('lotdetails').innerHTML = 
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
		document.getElementById('lotdetails').innerHTML = '<p>Click on a lot for details...</p>';
		map.setFeatureState({source: 'bldgSource2', id: clickStateId}, { click: false});
  }
});

//Change the cursor to a pointer when the mouse is over the lots layer.
map.on('mouseenter', 'LL97_Lots', function () {
map.getCanvas().style.cursor = 'pointer';
});

//Change the cursor to a pointer when the mouse is over the lots geojson layer.
map.on('mouseenter', '97', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseenter', '92', function () {
map.getCanvas().style.cursor = 'pointer';
});map.on('mouseenter', '94', function () {
map.getCanvas().style.cursor = 'pointer';
});
//Change it back to a pointer when it leaves.
map.on('mouseleave', '97', function () {
map.getCanvas().style.cursor = '';
});
map.on('mouseleave', '92', function () {
map.getCanvas().style.cursor = '';
});
map.on('mouseleave', '94', function () {
map.getCanvas().style.cursor = '';
});
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));				