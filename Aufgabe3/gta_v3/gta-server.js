/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */

/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var postion = [];
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
var slongitude = 8.393843;
var slatitude = 49.006749799999994;


// Setze ejs als View Engine
app.set('view engine', 'ejs');

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

app.use(express.static(__dirname + '/public'));
// TODO: CODE ERGÄNZEN

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */

function GeoTag(latitude, longitude, TagName, hTag){

	this.latitude = latitude;
	this.longitude = longitude;
	this.TagName = TagName;
	this.hTag = hTag;
}


// TODO: CODE ERGÄNZEN

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

var GeoTags = new Object();

GeoTags.array = [];

GeoTags.searchRadius = function(latitude, longitude, radius) {
	var returnGeoTags = [];	


	GeoTags.array.forEach(function(entry) {
		var localRadius = Math.sqrt(Math.pow( latitude - entry.latitude, 2) + Math.pow(longitude - entry.longitude , 2));
	//	if ( localRadius <= radius) {
			returnGeoTags.push(entry);
//		}
	})
	return returnGeoTags;	
}

GeoTags.searchName = function(tagName, array) {
	if (typeof array == 'undefined') {
		array = GeoTags.array;
	}
	var returnGeoTags = [];	
	array.forEach(function(entry) {
	console.log(entry.TagName + tagName);
		if ( entry.TagName == tagName) {
			returnGeoTags.push(entry);
		}
	});
	return returnGeoTags;

}

GeoTags.addGeoTag = function(newGeoTag) {
	GeoTags.array.push(newGeoTag);
}

GeoTags.deleteGeoTag = function(oldGeoTag) {
	if (GeoTags.array[GeoTags.array.length -1] == oldGeoTag) {
		GeoTags.array.pop();
	}else{
		var index;
		for (index =0; index < GeoTags.array.length; index++) {

			if(GeoTags.array[index] == oldGeoTag) {
				GeoTags.array.splice(index, 1, GeoTags.array.pop());
				break;
			}
		}
	}
}

function getPosition() {
	if (GeoTags.array.length == 0){
		return [slatitude, slongitude];
	}
	var actualTag = GeoTags.array[GeoTags.array.length-1];
	return [actualTag.latitude, actualTag.longitude];
}
/*
function savePosition(recievedData) {	
	position[0] = recievedData.coords.latitude;
	position[1] = recievedData.coords.longitude;
	
}
	


// TODO: CODE ERGÄNZEN

/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function (req, res) {
	var position = getPosition();
	res.render('gta', {
		taglist: [],
		currentPosition: []		
    });
});

// TODO: CODE ERGÄNZEN START

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */

app.post('/tagging', function(req, res) {
	var newGeoTag = new GeoTag(req.body.latitude, req.body.longitude, req.body.geoName, req.body.hashtag);
	GeoTags.addGeoTag(newGeoTag);
    res.render('gta', {
        taglist: GeoTags.searchRadius(slatitude, slongitude, 0.01),
		currentPosition: [newGeoTag.latitude, newGeoTag.longitude]
    });
});

// TODO: CODE ERGÄNZEN START

/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */

app.post('/discovery', function(req,res) {
	position = getPosition();
	res.render('gta', {
		taglist: GeoTags.searchName(req.body.searchterm, GeoTags.searchRadius(slatitude, slongitude, 0.01)),
		currentPosition: position
	});
});

// TODO: CODE ERGÄNZEN

/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);
