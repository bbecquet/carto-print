import d3 from 'd3';
import topojson from 'topojson';

function draw () {
    //erase previously drawn svg
    d3.select("svg").remove();
    const width = 500, //style.viewport.width,
        height = 300; //style.viewport.height;

    //create svg element
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    //clip container. #clip is a reference to a def that is added at the very last moment to the svg string
    const svgRoot = svg.append("g")
        .attr('clip-path', 'url(#clip)');

    const projection = d3.geo.mercator();
        // d3.geo.conicConformal()
        // .scale(parseInt($('.js-scale').val()))
        // .translate([parseInt($('.js-center-x').val()), parseInt($('.js-center-y').val())])
        // .clipAngle(90);

    window.proj = projection;

    /*
    const path = d3.geo.path().pointRadius(function(d) {
        return (d.properties && d.properties.opened) ?
            style.assembly.radius :
            style.assemblyConstruct.radius;
    }).projection(projection);
    */

    const path2 = d3.geo.path().pointRadius(1).projection(projection);

    //ocean
    svgRoot.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'ocean');

    d3.json("world-50m.json", function(error, data) {
        if (error) return console.error(error);
        console.log(data);

        svgRoot.append('path')
            .datum(topojson.mesh(data, data.objects.land))
            .attr('d', d3.geo.path().projection(projection))
            .attr('class', 'land');

        svgRoot.append('path')
            .datum(topojson.mesh(data, data.objects.countries))
            .attr('d', d3.geo.path().projection(projection))
            .attr('class', 'country-boundary');
    });

    /*
    const dataPaths = Object.keys(data);
    dataPaths.forEach(function(dataPath) {
        Layers[dataPath]();
    });
    */
}

const Layers = {
    land: function() {
        //land
        svgRoot.append("g").attr("id", "countries").selectAll("path")
            .data(data.land.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                if (['France','Germany','United Kingdom', 'Spain', 'Belgium', 'Italy'].indexOf(d.properties.admin) > -1 ) {
                    return '#F4783D';
                }
                return '#FFF';
            } )
            .attr("stroke", '#FFF')
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 1);
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

const app = {
    draw
};

export default app;
