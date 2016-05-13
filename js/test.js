var vertices = new Array();
var width = 960,
    height = 500;
var color = d3.scale.category10();
var r = 6;
var force = d3.layout.force().size([width, height]);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
$(function() {

    var json = "{\"nodes\":[{\"name\":\"language\",\"group\":1,\"fontsize\":\"45px\",\"title\":null},{\"name\":\"english\",\"group\":1,\"fontsize\":\"35px\",\"title\":null},{\"name\":\"languages\",\"group\":1,\"fontsize\":\"21px\",\"title\":null},{\"name\":\"speak\",\"group\":1,\"fontsize\":\"16px\",\"title\":null},{\"name\":\"religion\",\"group\":1,\"fontsize\":\"16px\",\"title\":null},{\"name\":\"words\",\"group\":1,\"fontsize\":\"16px\",\"title\":null},{\"name\":\"living\",\"group\":1,\"fontsize\":\"16px\",\"title\":null},{\"name\":\"adobe\",\"group\":2,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"malayalam\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"learn\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"multilanguage\",\"group\":3,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"different\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"sarcasm\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"linkedin\",\"group\":4,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"hindi\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"indesign\",\"group\":5,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"city\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"spanish\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"religious\",\"group\":1,\"fontsize\":\"15px\",\"title\":null},{\"name\":\"real\",\"group\":1,\"fontsize\":\"15px\",\"title\":null}],\"links\":[{\"source\":0,\"target\":1,\"value\":1},{\"source\":0,\"target\":2,\"value\":1},{\"source\":0,\"target\":3,\"value\":1},{\"source\":0,\"target\":4,\"value\":1},{\"source\":0,\"target\":5,\"value\":1},{\"source\":1,\"target\":2,\"value\":1},{\"source\":1,\"target\":3,\"value\":1},{\"source\":1,\"target\":5,\"value\":1},{\"source\":1,\"target\":6,\"value\":1},{\"source\":2,\"target\":3,\"value\":1},{\"source\":2,\"target\":4,\"value\":1},{\"source\":2,\"target\":5,\"value\":1},{\"source\":3,\"target\":5,\"value\":1},{\"source\":3,\"target\":8,\"value\":1},{\"source\":4,\"target\":5,\"value\":1},{\"source\":4,\"target\":6,\"value\":1},{\"source\":4,\"target\":11,\"value\":1},{\"source\":5,\"target\":6,\"value\":1},{\"source\":6,\"target\":2,\"value\":1},{\"source\":6,\"target\":11,\"value\":1},{\"source\":6,\"target\":18,\"value\":1},{\"source\":8,\"target\":0,\"value\":1},{\"source\":8,\"target\":2,\"value\":1},{\"source\":8,\"target\":14,\"value\":1},{\"source\":9,\"target\":0,\"value\":1},{\"source\":9,\"target\":1,\"value\":1},{\"source\":9,\"target\":2,\"value\":1},{\"source\":9,\"target\":3,\"value\":1},{\"source\":9,\"target\":8,\"value\":1},{\"source\":11,\"target\":0,\"value\":1},{\"source\":11,\"target\":1,\"value\":1},{\"source\":11,\"target\":2,\"value\":1},{\"source\":11,\"target\":3,\"value\":1},{\"source\":12,\"target\":0,\"value\":1},{\"source\":12,\"target\":1,\"value\":1},{\"source\":12,\"target\":2,\"value\":1},{\"source\":12,\"target\":3,\"value\":1},{\"source\":12,\"target\":14,\"value\":1},{\"source\":14,\"target\":0,\"value\":1},{\"source\":14,\"target\":1,\"value\":1},{\"source\":14,\"target\":2,\"value\":1},{\"source\":14,\"target\":3,\"value\":1},{\"source\":14,\"target\":5,\"value\":1},{\"source\":16,\"target\":0,\"value\":1},{\"source\":16,\"target\":1,\"value\":1},{\"source\":16,\"target\":2,\"value\":1},{\"source\":16,\"target\":9,\"value\":1},{\"source\":16,\"target\":11,\"value\":1},{\"source\":17,\"target\":0,\"value\":1},{\"source\":17,\"target\":1,\"value\":1},{\"source\":17,\"target\":2,\"value\":1},{\"source\":17,\"target\":3,\"value\":1},{\"source\":18,\"target\":2,\"value\":1},{\"source\":18,\"target\":4,\"value\":1},{\"source\":18,\"target\":5,\"value\":1},{\"source\":18,\"target\":11,\"value\":1},{\"source\":19,\"target\":0,\"value\":1},{\"source\":19,\"target\":1,\"value\":1},{\"source\":19,\"target\":2,\"value\":1},{\"source\":19,\"target\":3,\"value\":1},{\"source\":19,\"target\":5,\"value\":1}]}";

    json = htmlDecode(json);

    json = $.parseJSON(json);

    svg.append("svg:rect").attr("width", width).attr("height", height).style("stroke", "#fff").style("fill", "#fff");

    force.nodes(json.nodes).links(json.links).gravity(0.05).linkDistance(120).charge(-200).start();

    var node = svg.selectAll(".node").data(json.nodes).enter().append("g").attr("class", "node").attr("grp", function(d) {
        return (d.group)
    });
    var link = svg.selectAll(".link").data(json.links).enter().append("line").attr("class", "link").style("stroke-opacity", "0.2");

    node.append('circle').attr('r', function(d) {
        var tmprad = parseInt(d.fontsize.replace('px', '')) * (d.name.length / 3);
        if (tmprad > r) r = tmprad;
        return tmprad;
    }).style('fill', '#ffffff').style('stroke', function(d) {
        return color(d.group)
    });

    node.selectAll('text').data(json.nodes).enter().append("text").attr("text-anchor", "middle").attr("dx", 2).attr("dy", ".35em").attr('original-title', function(d) {
        return d.title
    }).attr("style", function(d) {
        return "font-size:" + d.fontsize
    }).text(function(d) {
        return d.name
    }).attr("style", function(d) {
        return "font-size:" + d.fontsize
    }).style('fill', function(d) {
        return color(d.group)
    }).style("cursor", "pointer").call(force.drag);

    var cx = new Array();
    var cy = new Array();

    node.attr("cx", function(d) {
        cx.push(d.x);
    }).attr("cy", function(d) {
        cy.push(d.y);
    });

    cx.forEach(function(o, i) {
        vertices.push(new Array(cx[i], cy[i]));
    });

    var nodes = vertices.map(Object);
    //console.log(node[0]);
    var groups = d3.nest().key(function(d) {
        //console.log($(d).attr("grp"));
        return $(d).attr("grp");
    }).entries(node[0]);

    var groupPath = function(d) {
        return "M" + d3.geom.hull(d.values.map(function(i) {
            console.log(i);
            return [$(i).attr("cx"), $(i).attr("cy")];
        })).join("L") + "Z";
    };

    var groupFill = function(d, i) {
        return color(d.key);
    };

    svg.style("opacity", 1e-6).transition().duration(1000).style("opacity", 1);


    force.on("tick", function() {


        link.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });


        node.attr("cx", function(d) {
            return d.x = Math.max(r, Math.min(width - r, d.x));
        }).attr("cy", function(d) {
            return d.y = Math.max(r, Math.min(height - r, d.y));
        });

        node.selectAll('circle').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"
        });

        // reposition text
        node.selectAll('text').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"
        });

      svg.selectAll("path")
        .data(groups)
        .attr("d", groupPath)
        .enter().insert("path", "g")
        .style("fill", groupFill)
        .style("stroke", groupFill)
        .style("stroke-width", 100)
        .style("stroke-linejoin", "round")
        .style("opacity", .2)
        .attr("d", groupPath);


    });
});

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function move() {
    vertices[0] = d3.svg.mouse(this);
    update();
}

function click() {
    vertices.push(d3.svg.mouse(this));
    update();
}

function update() {
    svg.selectAll("path").data([d3.geom.hull(vertices)]).attr("d", function(d) {
        return "M" + d.join("L") + "Z";
    }).enter().append("svg:path").attr("d", function(d) {
        return "M" + d.join("L") + "Z";
    });

    svg.selectAll("nodes").data(vertices.slice(1)).enter().append("svg:circle").attr("transform", function(d) {
        return "translate(" + d + ")";
    });
}
