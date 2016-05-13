var dataPaths = [
    'land',
    //'admin',
    // 'waterways',
    // 'regions_inner',
    // 'cities',
    'assemblies_open',
    'assemblies_construct',
];

var datasets = {
    assemblies:     ['land', 'admin', 'waterways', 'regions_inner', 'cities', 'hives_merged'],
    producers:      ['land', 'admin', 'waterways', 'regions_inner', 'cities', 'prods_IDF']
};

var regions = {
    Europe :    [1800, 360, 400],
    France :    [4100, 360, 360],
    IDF :       [39000, 160, 1600]
};

var data = {};

// TODO: define outside
var themes = {
    'print' : {
      viewport: {
        width        : 800,
        height       : 800
      },
      ocean: {
        color        : '#9EDBF0'
      },
      country: {
        color        : '#F4783D',
        outline      : '#FFF',
        outlineWidth : 2
      },
      countryNoHives: {
        color        : '#FEEA31'
      },
      region: {
        outline      : '#5A212D',
        outlineWidth : 1
      },
      city: {
        color        : '#005C8E',
        fontSize     : "16px",
      },
      waterways: {
        color        : '#6ACBDE',
        outlineWidth : 1,
        opacity      : .8
      },
      assembly: {
        color        : '#FDE94B',
        outline      : '#FDDB45',
        outlineWidth : '.2',
        radius       : '2'
      },
      assemblyConstruct: {
        color        : '#FFDD00',
        outline      : '#FFDDB6',
        outlineWidth : '0',
        radius       : '1.6'
      },
      producer: {
        color: '#9927A1'
      }
    },

    'web' : {
      viewport: {
        width        : 800,
        height       : 800
      },
      ocean: {
        color        : '#afe1e1'
      },
      country: {
        color        : '#ffe8d2',
        outline      : '#55508c',
        outlineWidth : 2,
        outlineOpacity      : .5
      },
      countryNoHives: {
        color        : '#c6baae'
      },
      region: {
        outline      : '#55508c',
        outlineWidth : .5
      },
      city: {
        color        : '#005C8E',
        fontSize     : "16px",
      },
      waterways: {
        color        : '#6ACBDE',
        outlineWidth : 1,
        opacity      : .8
      },
      assembly: {
        color        : '#55508c',
        outline      : '#7f769d',
        outlineWidth : '0',
        radius       : '2'
      },
      assemblyConstruct: {
        color        : '#ffffff',
        outline      : '#000000',
        outlineWidth : '.3',
        radius       : '1.6'
      },
      producer: {
        color: '#9927A1'
      }
    }
};

var style = themes.web;

loadDatum();
function loadDatum() {
    var path = dataPaths.shift();
    // TODO: replace by promise implementation
    d3.json('./data/'+path+'.geojson', function(datum) {
        data[path] = datum;

        if (dataPaths.length > 0) {
            loadDatum();
        } else {
            draw();
        }
    });
}

var svgRoot, path, path2, projection;

function draw() {
    //erase previously drawn svg
    d3.select("svg").remove();
    var width = style.viewport.width,
        height = style.viewport.height;

    //create svg element
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    //clip container. #clip is a reference to a def that is added at the very last moment to the svg string
    svgRoot = svg.append("g")
        .attr('clip-path', 'url(#clip)');

    projection = d3.geo.conicConformal()
        .scale(parseInt($('.js-scale').val()))
        .translate([parseInt($('.js-center-x').val()), parseInt($('.js-center-y').val())])
        .clipAngle(90);

    projection.rotate([-2, -47, -3]);

    path = d3.geo.path().pointRadius(function(d) {
        return (d.properties && d.properties.opened) ?
            style.assembly.radius :
            style.assemblyConstruct.radius;
    })
    .projection(projection);

    path2 = d3.geo.path().pointRadius(1).projection(projection);

    //ocean
    svgRoot.append("rect")
        .attr('fill', style.ocean.color)
        .attr('width', width)
        .attr('height', height);

    //graticules
    var graticule = d3.geo.graticule();
    svgRoot.append("path")
        .datum(graticule)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", ".1")
        .attr("stroke-width", "1")
        .attr("d", path);

    var dataPaths = Object.keys(data);
    dataPaths.forEach(function(dataPath) {
        Layers[dataPath]();
    });
}

var Layers = {

    land: function() {
        //land
        svgRoot.append("g").attr("id", "countries").selectAll("path")
            .data(data.land.features )
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                if (['France','Germany','United Kingdom', 'Spain', 'Belgium', 'Italy'].indexOf(d.properties.admin) > -1 )
                    return style.country.color; else return style.countryNoHives.color;
            } )
            .attr("stroke", style.country.outline)
            .attr("stroke-width", style.country.outlineWidth)
            .attr("stroke-opacity", style.country.outlineOpacity);
    },

    admin: function() {
        //admin (IDF)
        svgRoot.append("g").attr("id", "idf").selectAll("path")
            .data(data.admin.features, function(d) { return d.geometry.coordinates[0]; })
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", style.region.outline)
            .attr("stroke-width", style.region.outlineWidth );
    },

    assemblies_open: function() {
        svgRoot.append("g").attr("id", "hives").selectAll("path")
            .data(data.assemblies_open.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.properties.id; })
            .attr("stroke",         style.assembly.outline)
            .attr("stroke-width",   style.assembly.outlineWidth)
            .attr("fill",           style.assembly.color);
    },

    assemblies_construct: function() {
        svgRoot.append("g").attr("id", "hives").selectAll("path")
            .data(data.assemblies_construct.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.properties.id; })
            .attr("stroke", style.assemblyConstruct.outline)
            .attr("stroke-width", 0)
            .attr("fill", '#ff0088');
    }
};

$('.js-save').on('click', function() {
    //add cropping info with raw html
    var svgString = '<svg width="800" height="800"><defs><rect id="rect" width="100%" height="100%" fill="none" /><clipPath id="clip"><use xlink:href="#rect"/></clipPath></defs><use xlink:href="#rect"/>';
    svgString += $('svg')[0].innerHTML;
    svgString += '</svg>';

    var blob = new Blob( [ svgString ], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, "vector_map.svg");
});

$('.js-controls input').on('change', function(e) {
    draw();
});

$('.js-dataset a').on('click', function(e) {
    var datasetName = e.target.innerText;
    dataPaths = datasets[datasetName];
    data = {};
    loadDatum();
});

$('.js-region a').on('click', function(e) {
    var regionName = e.target.innerText;
    var region = regions[regionName];
    $('.js-scale').val(region[0]);
    $('.js-center-x').val(region[1]);
    $('.js-center-y').val(region[2]);
    draw();
});
