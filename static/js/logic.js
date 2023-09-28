var map = L.map('map').setView([0,-40], 3);

let techtonicplates = new L.layerGroup()
let earthquakes = new L.layerGroup()

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
                    depth<30 ?
                    'lime' :
                    depth<50 ?
                    'yellow' :
                    depth<70 ?
                    'peachpuff' :
                    depth<90 ?
                    'orange' : 'red'  

            };
        }
    }).bindPopup(function ({feature}) {
        let mag = feature.properties.mag;
        let place = feature.properties.place

        return `<h3>${place}<br>Magnitude: ${mag}</h3>`;
    }).addTo(earthquakes);
});


d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(data=>{
    console.log(data)
    L.geoJSON(data,{
        color: 'orange',
        weight: 2,

    }).addTo(techtonicplates);
})

// L.control.layers(
//     {},{overlays:{
//         "Techtonic Plates":techtonicplates,
//         "Earthquakes":earthquakes
//     }}).addTo(map);

L.control.layers({},{"Eathquakes":earthquakes,"Techtonic Plats":techtonicplates}).addTo(map);

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML += `
                <div style="background:green;color:white;padding:5px">-10 -10</div>
                <div style="background:lime;color:black;padding:5px">10 - 30</div>
                <div style="background:yellow;color:black;padding:5px">30 - 50</div>
                <div style="background:peachpuff;color:black;padding:5px">50 - 70</div>
                <div style="background:orange;color:black;padding:5px">70 - 90</div>
                <div style="background:red;color:white;padding:5px">90+</div>
            `

       
    return div;
};

legend.addTo(map);

