"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function draw() {
    //erase previously drawn svg
    _d2.default.select("svg").remove();
    var width = 500,
        //style.viewport.width,
    height = 300; //style.viewport.height;

    //create svg element
    var svg = _d2.default.select("body").append("svg").attr("width", width).attr("height", height);

    //clip container. #clip is a reference to a def that is added at the very last moment to the svg string
    var svgRoot = svg.append("g").attr('clip-path', 'url(#clip)');

    var projection = _d2.default.geo.conicConformal()
    /*.scale(parseInt($('.js-scale').val()))
    .translate([parseInt($('.js-center-x').val()), parseInt($('.js-center-y').val())])*/
    .clipAngle(90);

    projection.rotate([-2, -47, -3]);

    /*
    const path = d3.geo.path().pointRadius(function(d) {
        return (d.properties && d.properties.opened) ?
            style.assembly.radius :
            style.assemblyConstruct.radius;
    }).projection(projection);
    */

    var path2 = _d2.default.geo.path().pointRadius(1).projection(projection);

    //ocean
    svgRoot.append("rect").attr('fill', '#0b0').attr('width', width).attr('height', height);

    //graticules
    var graticule = _d2.default.geo.graticule();
    svgRoot.append("path").datum(graticule).attr("fill", "none").attr("stroke", "#000").attr("stroke-opacity", ".1").attr("stroke-width", "1").attr("d", path);

    var dataPaths = Object.keys(data);
    dataPaths.forEach(function (dataPath) {
        Layers[dataPath]();
    });
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