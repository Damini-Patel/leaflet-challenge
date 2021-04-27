/////////////////////////////////////////////
// Step 1: create basic map layer
////////////////////////////////////////////

// Create our map, giving it a display on load
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

// Define streetmap layer
var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY,
  }
).addTo(myMap);

/////////////////////////////////////////////
// Step 2: Store query URL
////////////////////////////////////////////

// Store our API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

/////////////////////////////////////////////
// Step 3: Get GeoJSON with D3 and query url
////////////////////////////////////////////

// Use d3 to call GeoJSON
d3.json(queryUrl, function (data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
  }
  // SET FUNCTIONS FOR MAGNITUDE COLOUR AND RADIUS
  // set function for different color from magnitude
  function getColor(magnitude) {
    switch (true) {
      case magnitude >= 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  // set radius from magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  //ADD GEOJSON LAYER TO THE MAP
  // add coordinates for each circle
  L.geoJson(data, {
    // Make cricles
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // circle style
    style: styleInfo,
    // add popup for each marker
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Location: " +
          feature.properties.place
      );
    },
  }).addTo(myMap);

  //ADD LEGEND TO THE MAP
  var legend = L.control({
    position: "bottomright",
  });

  // details for the legend
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(i) + '"></i> ' + labels[i] + "<br>";
    }
    return div;
  };
  // Add the info legend to the map
  legend.addTo(myMap);
});
