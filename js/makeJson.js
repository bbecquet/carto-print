window.makeJson = function() {
    $.getJSON( "./data/raw/lat lng - constellation.json", function(constellationHives) {
        var constellations = _.uniq(
            _.map(constellationHives, function(h) {
                  return [ h.constellation, { status: 'Mature', aire: h.aire } ];
            }),
            false,
            function(item) {
                return item[0];
            });

        loadHives(constellationHives);
    });
};

function loadHives(constellationHives) {
    var hives = [];

    var clusters = {France:{total:0, openTotal:0}};
    $.getJSON( 'https://api.thefoodassembly.com/hives/?summary=true', function(hives_eu) {
        total = hives_eu._embedded.hives.length;
        for (var i = 0; i < hives_eu._embedded.hives.length; i++) {
            var hiveIn = hives_eu._embedded.hives[i];
            var hiveOut = {};

            var countryCode = hiveIn._embedded.place._embedded.address._embedded.country.code;
            var country = _.find(window.clusters.countries.values, function(c) {
                return _.contains(c.values, countryCode);
            });

            if (!country) {
                //Polynésie française :(
                continue;
            }

            var coordinates = hiveIn._embedded.place._embedded.address._embedded.coordinates;

            if (!clusters[country.name]) {
                clusters[country.name] = {total:0, openTotal:0};
            }
            clusters[country.name].total++;

            var constellation = _.findWhere(constellationHives, {hive_id: parseInt(hiveIn.id)});

            hiveOut.name = hiveIn.name;
            hiveOut.id = hiveIn.id;
            hiveOut.lat = coordinates.latitude.toString();
            hiveOut.lon = coordinates.longitude.toString();
            hiveOut.opened = hiveIn.status === 'open';

            if (hiveOut.opened) {
                clusters[country.name].openTotal++;
            };

            if (constellation) {
                hiveOut.constellation = constellation.constellation;
                hiveOut.aire = constellation.aire;
            }

            hives.push(hiveOut);
        }

        window.makeGeoJson(hives);
    });
}

window.makeGeoJson = function(data) {
    var geoJson = {
        type:  "FeatureCollection",
        features: []
    };

    for (var i = 0; i < data.length; i++) {
        var dataIn = data[i];

        geoJson.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [dataIn.lon, dataIn.lat]
            },
            "properties": {
                "id": dataIn.id,
                "opened": dataIn.opened,
                "constellation" : dataIn.constellation,
                "aire" : dataIn.aire
            }
        });
    }

    console.log(JSON.stringify(geoJson));
};

window.clusters = {
    'countries' : {
        'defaultGroupingField': 'place.address.country.code',
        'values' : [
            {
                'name': 'France',
                'id': 1,
                'values': ['FR'],
            },
            {
                'name': 'Belgique',
                'id': 2,
                'values': ['BE'],
            },
            {
                'name': 'España',
                'id': 3,
                'values': ['ES'],
            },
            {
                'name': 'Deutschland',
                'id': 4,
                'values': ['DE']
            },
            {
                'name': 'United Kingdom',
                'id': 5,
                'values': ['GB']
            },
            {
                'name': 'Italia',
                'id' : 6,
                'values': ['IT']
            }
        ]
    }
};
