import d3 from 'd3';
import topojson from 'topojson';
import Layer from './Layer.js';

function draw () {
    const width = 800;
    const height = 500;

    d3.select("svg").remove();

    const svg = d3.select("body").append("svg")
        .attr('class', 'ocean')
        .attr({width, height});

    //clip container. #clip is a reference to a def that is added at the very last moment to the svg string
    const svgRoot = svg.append("g")
        .attr('clip-path', 'url(#clip)');

    const zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.call(zoom)
        .call(zoom.event);

    function zoomed() {
        svgRoot.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    const projection = d3.geo.mercator()
        .center([2.35, 48.85])
        .scale(500);
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

    const layers = [];
    layers.push(new Layer({
        id: 'land',
        source: 'data/world-50m.json',
        objectName: 'land',
        attrs: {
            'class': 'land'
        }
    }));
    // layers.push(new Layer({
    //     id: 'countries',
    //     source: 'data/world-50m.json',
    //     objectName: 'countries',
    //     attrs: {
    //         'class': 'country-boundary'
    //     }
    // }));
    layers.push(new Layer({
        id: 'regions',
        source: 'data/regions_filtered.topojson',
        objectName: 'regions_filtered',
        attrs: {
            'class': 'region-boundary'
        }
    }));

    layers.forEach(l => l.draw(svgRoot, projection));
}

// TODO: reprendre idée avec tableau
// const Layers = {
//     land: function() {
//         //land
//         svgRoot.append("g").attr("id", "countries").selectAll("path")
//             .data(data.land.features)
//             .enter()
//             .append("path")
//             .attr("d", path)
//             .attr("fill", function(d) {
//                 if (['France','Germany','United Kingdom', 'Spain', 'Belgium', 'Italy'].indexOf(d.properties.admin) > -1 ) {
//                     return '#F4783D';
//                 }
//                 return '#FFF';
//             } )
//             .attr("stroke", '#FFF')
//             .attr("stroke-width", 2)
//             .attr("stroke-opacity", 1);
//     }
// };

const app = {
    draw
};

export default app;
