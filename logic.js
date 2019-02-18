// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    
    var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  onEachFeature: function (feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude: "+ feature.properties.mag +  
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"+ feature.properties.place +"</p>");
  },
  pointToLayer: function (feature, latlng) {
    return new L.circle(latlng,
      {radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      fillOpacity: .6,
      color: "#000",
      stroke: true,
      weight: .8
  })
    }   
    });
    
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    
  });
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      45, -120.50
    ],
    zoom: 3.5,
    layers: [darkmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div', 'info legend'),
      bucket_groups = [0, 1, 2, 3, 4, 5],
      labels = [];

  for (var i = 0; i < bucket_groups.length; i++) {
      div.innerHTML +=
       '<i style="background:' + getColor(bucket_groups[i] + 1) + '"></i> ' +
          bucket_groups[i] + (bucket_groups[i + 1] ? '&ndash;' + bucket_groups[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap);
}

function getRadius(value){
    return value*10000
  }

  function getColor(d){
    return d > 5 ? "#2C3E50":
    d  > 4 ? "#5B2C6F":
    d > 3 ? "#3383FF":
    d > 2 ? "#FCFF33":
    d > 1 ? "#33FF46":
             "white";
  }
