/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator() {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function (onsuccess, onerror) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onsuccess, function (error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

// Funktion, die Koordinaten erhält von trylocate().
// Im index.html werden latitude und lingitude ein ID zugewiesen,
// und hier mit x bzw. y initialisiert. x/x2 und y/y2 wird dann mit
// den Werten aus unseren Koordinaten zugewiesen.
// x2 und y2 sind die versteckten Eingabefelder in Discovery.
// Letzter Abschnitt Zusaufgabe : getLocationMapSrc() gibt uns ein Link für ein Bild,
// welches wir dann z zuweisen. Vorher wird die id "result-img" noch mit z verknüpft.
	var positiondata = function(recievedData) {
		var x = document.getElementById("latitude");
		var y = document.getElementById("longitude");
		x.value = getLatitude(recievedData);
		y.value = getLongitude(recievedData);
		
		var x2 = document.getElementById("latitude2");
		var y2 = document.getElementById("longitude2");
		x2.value = getLatitude(recievedData);
		y2.value = getLongitude(recievedData);
		
		var url = getLocationMapSrc(getLatitude(recievedData),getLongitude(recievedData));	
		var z = document.getElementById("result-img");
		z.src = url;
	}
	// Funktion, die eine Box erscheinen lässt, mit einem Error String.
	var returnerror = function(errorString) {
		alert(errorString);
	}
    // Auslesen Breitengrad aus der Position
    var getLatitude = function (position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function (position) {
        return position.coords.longitude;
    };

    // Hier Google Maps API Key eintragen
    var apiKey = "AIzaSyDqfyv48UOYomgDhLxLtNGWBTQ8CULGgPU";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function (lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 10;

        if (apiKey === "YOUR API KEY HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "";
        if (typeof tags !== 'undefined') tags.forEach(function (tag) {
            tagList += "&markers=%7Clabel:" + tag.name
                + "%7C" + tag.latitude + "," + tag.longitude;
        });

        var urlString = "http://maps.googleapis.com/maps/api/staticmap?center="
            + lat + "," + lon + "&markers=%7Clabel:you%7C" + lat + "," + lon
            + tagList + "&zoom=" + zoom + "&size=640x480&sensor=false&key=" + apiKey;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };

    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",

		updateLocation: function () {
			tryLocate(positiondata,returnerror);	
		}

    }; // ... Ende öffentlicher Teil
})();

/**
 * $(document).ready wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(document).ready(function () {
    //alert("Hello World")
	gtaLocator.updateLocation();
    // TODO Hier den Aufruf für updateLocation einfügen
	
});
