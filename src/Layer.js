import d3 from 'd3';
import topojson from 'topojson';

class Layer {
    constructor(options) {
        this.data = null;
        this.id = options.id;
        this.sourceUrl = options.source;
        this.attrs = options.attrs || {};
        this.objectName = options.objectName;
    }

    _loadSource(cb) {
        d3.json(this.sourceUrl, (error, data) => {
            if (error) {
                return console.error(error);
            }
            this.data = data;
            cb();
        });
    }

    draw(svg, projection) {
        this.node = d3.select('#' + this.id);
        if(this.node.empty()) {
            this.node = svg.append('path').attr('id', this.id);
        }
        if(!this.data) {
            this._loadSource(() => { this.draw(svg, projection) });
            return;
        }
        this.node.datum(topojson.mesh(this.data, this.data.objects[this.objectName]))
            .attr('d', d3.geo.path().projection(projection))
            .attr(this.attrs);
    }
};

export default Layer;
