'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _topojson = require('topojson');

var _topojson2 = _interopRequireDefault(_topojson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function draw() {
    var width = 800;
    var height = 500;

    _d2.default.select("svg").remove();
    var svg = _d2.default.select("body").append("svg").attr({ width: width, height: height });

    //clip container. #clip is a reference to a def that is added at the very last moment to the svg string
    var svgRoot = svg.append("g").attr('clip-path', 'url(#clip)');

    var zoom = _d2.default.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    svg.call(zoom).call(zoom.event);

    function zoomed() {
        svgRoot.attr("transform", "translate(" + _d2.default.event.translate + ")scale(" + _d2.default.event.scale + ")");
    }

    var projection = _d2.default.geo.mercator();
    // d3.geo.conicConformal()
    // .scale(parseInt($('.js-scale').val()))
    // .translate([parseInt($('.js-center-x').val()), parseInt($('.js-center-y').val())])
    // .clipAngle(90);

    /*
    const path = d3.geo.path().pointRadius(function(d) {
        return (d.properties && d.properties.opened) ?
            style.assembly.radius :
            style.assemblyConstruct.radius;
    }).projection(projection);
    */

    var path2 = _d2.default.geo.path().pointRadius(1).projection(projection);

    //ocean
    svgRoot.append('rect').attr({
        width: width,
        height: height,
        'class': 'ocean'
    });

    _d2.default.json("world-50m.json", function (error, data) {
        if (error) return console.error(error);
        console.log(data);

        svgRoot.append('path').datum(_topojson2.default.mesh(data, data.objects.land)).attr('d', _d2.default.geo.path().projection(projection)).attr('class', 'land');

        svgRoot.append('path').datum(_topojson2.default.mesh(data, data.objects.countries)).attr('d', _d2.default.geo.path().projection(projection)).attr('class', 'country-boundary');
    });

    /*
    const dataPaths = Object.keys(data);
    dataPaths.forEach(function(dataPath) {
        Layers[dataPath]();
    });
    */
}

var Layers = {
    land: function land() {
        //land
        svgRoot.append("g").attr("id", "countries").selectAll("path").data(data.land.features).enter().append("path").attr("d", path).attr("fill", function (d) {
            if (['France', 'Germany', 'United Kingdom', 'Spain', 'Belgium', 'Italy'].indexOf(d.properties.admin) > -1) {
                return '#F4783D';
            }
            return '#FFF';
        }).attr("stroke", '#FFF').attr("stroke-width", 2).attr("stroke-opacity", 1);
    }

    /*,
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
    }*/
};

var app = {
    draw: draw
};

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=main.js.map