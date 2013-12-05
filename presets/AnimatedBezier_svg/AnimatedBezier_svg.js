/*jslint es5:true, white:false */
/*globals $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function () {

    var w = 250,
        h = 300,
        t = 0.5,
        delta = 0.01,
        padding = 10,
        points = $data,
        bezier = {},
        n = 4,
        line, stroke, orders, vis, last;

    function x(d) {
        return d.x;
    }

    function y(d) {
        return d.y;
    }

    function interpolate(d, p) {
        var r, i, d0, d1;

        if (arguments.length < 2) {
            p = t;
        }
        r = [];
        for (i = 1; i < d.length; i++) {
            d0 = d[i - 1];
            d1 = d[i];
            r.push({
                x: d0.x + (d1.x - d0.x) * p,
                y: d0.y + (d1.y - d0.y) * p
            });
        }
        return r;
    }

    function getLevels(d, t_) {
        var x, i;
        if (arguments.length < 2) {
            t_ = t;
        }
        x = [points.slice(0, d)];
        for (i = 1; i < d; i++) {
            x.push(interpolate(x[x.length - 1], t_));
        }
        return x;
    }

    function getCurve(d) {
        var curve, t_, x;

        curve = bezier[d];
        if (!curve) {
            curve = bezier[d] = [];
            for (t_ = 0; t_ <= 1; t_ += delta) {
                x = getLevels(d, t_);
                curve.push(x[x.length - 1][0]);
            }
        }
        return [curve.slice(0, t / delta + 1)];
    }


    function colour(d, i) {
        stroke(-i);
        return d.length > 1 ? stroke(i) : 'red';
    }

    function update() {
        var interpolation, circle, path, curve;

        interpolation = vis.selectAll('g') //
        .data(function (d) {
            return getLevels(d, t);
        });
        interpolation.enter().append('g') //
        .style('fill', colour) //
        .style('stroke', colour);

        circle = interpolation.selectAll('circle').data(Object);

        circle.enter().append('circle').attr('r', 4);
        circle.attr('cx', x).attr('cy', y);

        path = interpolation.selectAll('path') //
        .data(function (d) {
            return [d];
        });
        path.enter().append('path').attr('class', 'line').attr('d', line);
        path.attr('d', line);

        curve = vis.selectAll('path.curve').data(getCurve);
        curve.enter().append('path').attr('class', 'curve');
        curve.attr('d', line);

        vis.selectAll('text.controltext').attr('x', x).attr('y', y);
        vis.selectAll('text.t').text('t=' + t.toFixed(2));
    }

    line = d3.svg.line().x(x).y(y);
    stroke = d3.scale.category20b();
    orders = d3.range(2, n + 2);

    vis = d3.select('#playground') //
    .selectAll('svg') //
    .data(orders) //
    .enter().append('svg') //
    .attr('width', w + 2 * padding) //
    .attr('height', h + 2 * padding) //
    .append('g') //
    .attr('transform', 'translate(' + padding + ',' + padding + ')');

    update();

    vis.selectAll('circle.control').data(function (d) {
        return points.slice(0, d);
    }).enter().append('circle') //
    .attr('class', 'control') //
    .attr('r', 7) //
    .attr('cx', x) //
    .attr('cy', y) //
    .call(d3.behavior.drag() //
    .on('dragstart', function (d) {
        this.__origin__ = [d.x, d.y];
    }).on('drag', function (d) {
        d.x = Math.min(w, Math.max(0, this.__origin__[0] += d3.event.dx));
        d.y = Math.min(h, Math.max(0, this.__origin__[1] += d3.event.dy));
        bezier = {};
        update();
        vis.selectAll('circle.control').attr('cx', x).attr('cy', y);
    }).on('dragend', function () {
        delete this.__origin__;
    }));

    vis.append('text') //
    .attr('class', 't') //
    .attr('x', w / 2) //
    .attr('y', h) //
    .attr('text-anchor', 'middle');

    vis.selectAll('text.controltext') //
    .data(function (d) {
        return points.slice(0, d);
    }).enter() //
    .append('text') //
    .attr('class', 'controltext') //
    .attr('dx', '10px') //
    .attr('dy', '.4em') //
    .text(function (d, i) {
        return 'P' + i;
    });

    last = 0;

    d3.timer(function (elapsed) {
        t = (t + (elapsed - last) / 5000) % (1 | 0);
        last = elapsed;
        update();
    });

}());
