var map = L.map('map', {
	fullscreenControl: false,
	center: [52.507, 13.403],
	zoom: 11,
	minZoom: 10,
	maxZoom: 12,
	fullscreenControlOptions: {
		position: 'topleft'
	},
	maxBounds: ([[52.2,11.9],[52.814,14.9]])
});

mapLink = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: 'Hintergrundkarte &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> & &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

var year = L.control({position: 'topleft'});
year.onAdd = function (map) {
	var yearsel = L.DomUtil.create('div', 'year');
	yearsel.innerHTML =
        '<h3>Wählen Sie Jahr und </br>Phänomenbereich</br></h3><select id="disisdrop2" onchange="myFunction();paintitred();"><option>2015</option><option>2014</option><option>2013</option><option>2012</option><option>2011</option><option>2010</option><option>2009</option></select>&nbsp;&nbsp;<select id="disisdrop" onchange="myFunction();getthestyle();getlegstr();updateLeg();paintitred();"><option value="rGes" title="Politisch motivierte Kriminalität &ndash; gesamt">Gesamt</option><option value="rRe" title="Politisch motivierte Kriminalität &ndash; rechts">PMK &ndash; rechts</option><option value="rLi" title="Politisch motivierte Kriminalität &ndash; links">PMK &ndash; links</option><option value="Ausra" title="Politisch motivierte Ausländerkriminalität">PMAK</option></select>';//<option>Jahr</option>leaveChange();
	yearsel.firstChild.onmousedown = yearsel.firstChild.ondblclick = L.DomEvent.stopPropagation;
	return yearsel;
};

year.addTo(map);

function myFunction() {
	var str1 = document.getElementById("disisdrop").value;
	str2 = document.getElementById("disisdrop2").value;
	res = (str1.concat(str2));
	return (res,str2);
}

myFunction();

//set default style (Gesamtdaten)
currentStyle = rGesStyle;

function getthestyle() {
	if (document.getElementById("disisdrop").value === "Ausra") {
		currentStyle = AusraStyle;
	} else if (document.getElementById("disisdrop").value === "rLi") {
		currentStyle = rLiStyle;
	} else if (document.getElementById("disisdrop").value === "rRe") {
		currentStyle = rReStyle;
	} else {
		currentStyle = rGesStyle;
	}
}

function clickfeature(e) {
	if (typeof eold !== 'undefined') {
		resetHighlight(eold);
	}
	highlightFeature(e);
	eold=e;
	return eold;
}

var selected

function highlightFeature(e) {
	var layer = e.target;
	layer.setStyle({
		weight: 3,
		color: '#FFF',
		dashArray: '',
		fillOpacity: 0.9
	});
	selected = e.layer
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function resetHighlight(e) {
    BRDBerlin.resetStyle(e.target);
}


function onEachFeature(feature, layer) {
	layer.on({
		click: clickfeature
	});
	var gestr="Ges"+str2 ;
	var listr="Li"+str2  ;
	var restr="Re"+str2  ;
	var ausstr="Aus"+str2;
	var gewlistr="GewLi"+str2  ;
	var gewrestr="GewRe"+str2  ;
	var gewausstr="GewAus"+str2;
	layer.bindPopup('<b>' + feature.properties.BEZIRK + 
		'</b> Fälle ' + str2 + '<br> Gesamt: ' + feature.properties[gestr] + 
		'<br> PMK &ndash; rechts: ' + feature.properties[restr] + ' davon ' + feature.properties[gewrestr] + ' gewalttätig' +
		'<br> PMK &ndash; links: ' + feature.properties[listr] + ' davon ' + feature.properties[gewlistr] + ' gewalttätig' +
		'<br> PMAK: ' + feature.properties[ausstr] + ' davon ' + feature.properties[gewausstr] + ' gewalttätig'
	) ;
	layer.bindTooltip('<b>' + feature.properties.BEZIRK + '</b>')
	layer.on({
		click: function () {
			document.getElementById('bezchart').innerHTML = '<a href="image/' + 
				feature.properties.BEZIRK + '.svg"><img src="image/' + 
				feature.properties.BEZIRK + '.svg" width="100%" type="image/svg+xml"></img></a>';
			document.getElementById('ChartBez').innerHTML = '<a href="image/wahl_' + 
				feature.properties.BEZIRK + '.svg"><img src="image/wahl_' + 
				feature.properties.BEZIRK + '.svg" width="100%" type="image/svg+xml"></img></a>';
		}
	});
}

function paintitred() {
	if (typeof BRDBerlin !== "undefined") {
		map.removeLayer(BRDBerlin);
	}
	BRDBerlin = L.geoJson(Berlin, {
		style: currentStyle,
        onEachFeature: onEachFeature
	}).addTo(map);
}

/*=========================================================================
getrGesColor;rGesStyle;  rGesLegend
===========================================================================*/

function getrGesColor(c) {
	if (c > 200) {
		return '#1C324B';
	} else if (c > 100) {
		return '#2C4D75';
	} else if (c > 80) {
		return '#5F80A8';
	} else if (c > 60) {
		return '#99ADC7';
	} else if (c > 40) {
		return '#BDCADB';
	} else if (c > 20) {
		return '#D5DDE8';
	} else if (c >= 0) {
		return '#E4E9F1';
	}
}
	
function rGesStyle(feature) {
	return {
		fillColor: getrGesColor(feature.properties[res]),
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

var rGesLegend = L.control({position : 'bottomleft'});

rGesLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	grades = [0, 20, 40, 60, 80, 100, 200];
	labels = [];
	div.innerHTML = '<h3><b>Politisch motivierte <br>Kriminalität Gesamt</b><h3><p>';
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getrGesColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '\n&ndash;\n' + grades[i + 1] + '<br>' : '+');
	}
	div.innerHTML += '</p>Fälle pro 100 000 Einwohner'
	document.getElementById('chart').innerHTML ='<a href="image/Ges.svg"><img src="image/Ges.svg" width="100%" type="image/svg+xml"></img></a>'
	document.getElementById('Chart1').innerHTML = '<a href="image/wahlges.svg"><img src="image/wahlges.svg" width="100%" type="image/svg+xml"></img></a>';
	return div;
};

/*=========================================================================
getrReColor;rReStyle;  rReLegend
===========================================================================*/

function getrReColor(c){
	if (c > 70) {
		return '#4B321C';
	} else if (c > 60) {
		return '#754D2C';
	} else if (c > 50) {
		return '#A8805F';
	} else if (c > 40) {
		return '#C7AD99';
	} else if (c > 30) {
		return '#DBCABD';
	} else if (c > 20) {
		return '#E8DDD5';
	} else if(c >= 0) {
		return '#F1E9E4';
	}
}

function rReStyle(feature){
	return {
		fillColor: getrReColor(feature.properties[res]),
		weight: 1,
		opacity: 1, 
		color: 'white', 
		fillOpacity: 0.7
	}
}

var rReLegend = L.control({position : 'bottomleft'});

rReLegend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'legend');
	grades = [0, 20, 30, 40, 50, 60, 70],
	labels = [];
	div.innerHTML = '<h3><b>Rechte Kriminalität</b><h3><p>';
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getrReColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '\n&ndash;\n' + grades[i + 1] + '<br>' : '+');
	}
	div.innerHTML += '</p>Fälle pro 100 000 Einwohner'
	document.getElementById('chart').innerHTML ='<a href="image/Ges.svg"><img src="image/Ges.svg" width="100%" type="image/svg+xml"></img></a>'
	return div;
};

/*=========================================================================
getrLiColor;rLiStyle;  rLiLegend
===========================================================================*/

function getrLiColor(c) {
	if (c > 100) {
		return '#4B1C32';
	} else if (c > 50) {
		return '#752C4D';
	} else if (c > 40) {
		return '#A85F80';
	} else if (c > 30) {
		return '#C799AD';
	} else if (c > 20) {
		return '#DBBDCA';
	} else if (c > 10) {
		return '#E8D5DD';
	} else if (c >= 0) {
		return '#F1E4E9';
	}
}

function rLiStyle(feature) {
	currentStyle=rLiStyle;
	return {
		fillColor: getrLiColor(feature.properties[res]),
		weight: 1,
		opacity: 1, 
		color: 'white', 
		fillOpacity: 0.7
	}
}

var rLiLegend = L.control({position : 'bottomleft'});

rLiLegend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'legend');
	grades = [0,10, 20, 30, 40, 50, 100],
	labels = [];
	div.innerHTML = '<h3><b>Linke Kriminalität</b><h3><p>';
	for (var i = 0; i < grades.length; i++) {
		listring='<i style="background:' + getrLiColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '\n&ndash;\n' + grades[i + 1] + '<br>' : '+');
		div.innerHTML += listring
	}
	div.innerHTML += '</p>Fälle pro 100 000 Einwohner'
	document.getElementById('chart').innerHTML ='<a href="image/Ges.svg"><img src="image/Ges.svg" width="100%" type="image/svg+xml"></img></a>'
	return div;
};

/*=========================================================================
getAusraColor;AusraStyle;  AusraLegend
===========================================================================*/

function getAusraColor(c) {
	if (c > 100) {
		return '#324B1C';
	} else if (c > 50) {
		return '#4D752C';
    } else if (c > 40) {
		return '#80A85F';
	} else if (c > 30) {
		return '#ADC799';
	} else if (c > 20) {
		return '#CADBBD';
	} else if (c > 10) {
		return '#DDE8D5';
	} else if (c >= 0) {
		return '#E9F1E4';
	}
}
	
function AusraStyle(feature) {
	return {
		fillColor: getAusraColor(feature.properties[res]),
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	}
}

var AusraLegend = L.control({position : 'bottomleft'});

AusraLegend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'legend');
	grades = [0,10, 20, 30, 40, 50, 100],
	labels = [];
	div.innerHTML = '<h3>Politische motivierte<br>Kriminalität durch Ausländer<h3><p>';
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getAusraColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '\n&ndash;\n' + grades[i + 1] + '<br>' : '+');
	}
	div.innerHTML += '</p>Fälle pro 100 000 ausl. Einwohner'
	document.getElementById('chart').innerHTML = '<a href="image/Ges.svg"><img src="image/Ges.svg" width="100%" type="image/svg+xml"></img></a>'
	return div;
};

rGesLegend.addTo(map);
currentLegend = rGesLegend;
currentLegendstr = "rGesLegend";

function addlegend() {
	if (currentLegendstr === "rGesLegend") {
		rGesLegend.addTo(map)
	} else if (currentLegendstr === "rReLegend") {
		rReLegend.addTo(map)
	} else if (currentLegendstr === "rLiLegend") {
		rLiLegend.addTo(map)
	} else {
		AusraLegend.addTo(map)
	}
}

function getlegstr() {
	var legstr = document.getElementById("disisdrop").value
	legres = (legstr + "Legend");
	return legres;
}

function updateLeg() {
	map.removeControl(window[currentLegendstr])
	currentLegendstr=getlegstr();
	addlegend(currentLegendstr);
};

paintitred();

var sidebar = L.control.sidebar('sidebar', {position: 'right'}).addTo(map);

$('.charts').magnificPopup({
	delegate: 'a', // child items selector, by clicking on it popup will open
	type: 'image'
});

$('.graph_container').magnificPopup({
  delegate: 'a', // child items selector, by clicking on it popup will open
  type: 'image'
});

var gj = L.geoJson();
gj.getAttribution = function test() { return 'EPSG 3857 | <a href="Links.html">Datenquellen</a> | Alle Angaben ohne Gewähr.' };
gj.addTo(map);
