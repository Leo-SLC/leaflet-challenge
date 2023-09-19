var map = L.map('map').setView([0,-40], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(data=>{
    console.log(data.features[100])
    L.geoJSON(data, {
       pointToLayer: function(geoJsonPoint, latlng) {
        return L.circleMarker(latlng);
    },
        style: function (feature) {
            let mag = feature.properties.mag*4;
            let depth = feature.geometry.coordinates[2];

            return {
                radius: mag,
                fillOpacity: .65,
                weight: 0.8,
                color: 'black',
                fillColor: 
                    depth<10 ? 
                    'green' : 
                    depth<50 ?
                    'yellow' : 'red' 
            };
        }
    }).bindPopup(function ({feature}) {
        let mag = feature.properties.mag;
        let place = feature.properties.place

        return `<h3>${place}<br>Magnitude: ${mag}</h3>`;
    }).addTo(map);
});

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML += `
                <div style="background:green;color:white;padding:5px"><10</div>
                <div style="background:yellow;color:black;padding:5px">50</div>
                <div style="background:red;color:white;padding:5px">90+</div>
            `

       
    return div;
};

legend.addTo(map);

