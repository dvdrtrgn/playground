/*jslint es5:true, white:false */
/*globals $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function () {
    var width = 960,
        height = 500,
        points = [],
        bounds, line, svg, path;

    function circle(cx, cy, r, n, DO) { // δθ
        d3.range(1e-6, 2 * Math.PI, 2 * Math.PI / n).map(function (O) { // θ
            var point = [cx + Math.cos(O) * r, cy + Math.sin(O) * r];
            d3.timer(function () {
                O += DO;
                point[0] = cx + Math.cos(O) * r;
                point[1] = cy + Math.sin(O) * r;
            });
            points.push(point);
            return point;
        });
    }

    function circulate(arr) {
        var i = 0;
        while (arr[i]) {
            circle.apply(null, $data[i++]);
        }
    }

    function resample(points) {
        var i = -1,
            n = points.length,
            p0 = points[n - 1],
            x0 = p0[0],
            y0 = p0[1],
            p1, x1, y1, points2 = [];
        while (++i < n) {
            p1 = points[i];
            x1 = p1[0];
            y1 = p1[1];
            points2.push([(x0 * 2 + x1) / 3, (y0 * 2 + y1) / 3], [(x0 + x1 * 2) / 3, (y0 + y1 * 2) / 3], p1);
            p0 = p1;
            x0 = x1;
            y0 = y1;
        }
        return points2;
    }

    bounds = d3.geom.polygon([
        [-width / 2, - height / 2],
        [-width / 2, + height / 2],
        [+width / 2, + height / 2],
        [+width / 2, - height / 2]
        ]);

    circulate($data);

    line = d3.svg.line().interpolate('basis-closed');

    svg = d3.select('#playground') //
    .append('svg') //
    .attr('width', width) //
    .attr('height', height) //
    .append('g') //
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    path = svg.selectAll('path').data(points).enter().append('path');

    d3.timer(function () {
        var voronoi = d3.geom.voronoi(points).map(function (cell) {
            return bounds.clip(cell);
        });
        path.attr('d', function (point, i) {
            return line(resample(voronoi[i]));
        });
    });

}());
