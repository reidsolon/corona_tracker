const mapboxgl = require('mapbox-gl')

export {
    initializeMap,
    setFeatures,
}

var map
var CIRCLE_RADIUS = (FILTER) => {
    var array = [
        'interpolate',
        ['linear'],
        ['get', FILTER],
        1,
        2,
        50,
        4,
        100,
        7,
        500,
        8,
        1000,
        9,
        10000,
        12,
        20000,
        14
    ]
    console.log(array)
    return array
}

var popoverHTML = ( obj ) => {
    var data = obj
    return `
        <ul class="list-group">
            <li class="list-group-item text-center"><h6>${data['combinedKey']}</h6></li>
            <li class="list-group-item">Confirmed: ${data['confirmed']}</li>
            <li class="list-group-item">Recovered: ${data['recovered']}</li>
            <li class="list-group-item">Deaths: ${data['deaths']}</li>
        </ul>
    `
}

const initializeMap = (config) => {
    const ACCESS_TOKEN = config.accessToken
    const MAP_CENTER = config.center
    const MAP_ZOOM = config.zoom
    const MAP_ROOT = config.root
    const MAP_STYLE = config.mapStyle

    mapboxgl.accessToken = ACCESS_TOKEN;
    map = new mapboxgl.Map({
        container: MAP_ROOT, 
        style: MAP_STYLE, 
        center: MAP_CENTER, 
        zoom: MAP_ZOOM,
    })

    return map
}

const setFeatures = (
    data,
    filter = 'confirmed'
) => {
            if(map.isStyleLoaded){
                var featurePoint = {
                    'type': 'FeatureCollection',
                    'features': new Array()
                }
        
                if(data) {
                    var tempObj = {}
                    data.map( el => {
                        if(el[filter] > 0) {
                            tempObj = {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        el.long,
                                        el.lat
                                    ]
                                },
                                'properties': el
                            }
                            featurePoint.features.push(tempObj)
                        }
                    })
        
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': featurePoint
                    })
        
                    map.addLayer({
                        'id': 'points',
                        'type': 'circle',
                        'source': 'points',
                        'paint': {
                            'circle-radius': CIRCLE_RADIUS(filter),
                            'circle-color': "#4a7ac3",
                            'circle-opacity': 0.45
                        }
                    })
        
                    map.on('click', 'points', function(e) {
                        var coordinates = e.features[0].geometry.coordinates.slice()
                        
                        
                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                        }
                        
                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(popoverHTML(e.features[0].properties))
                            .addTo(map);
                    })
                }
        
                
                CIRCLE_RADIUS(filter)
                return featurePoint
            } else {
                alert('Map style ins`t loaded yet. Please reload the page.')
            }
    
}