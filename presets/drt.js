var svg = createSVG(),
    items;

items = svg
.selectAll("g")
.data($data)
.enter()
.append("g")
.attr("transform", function (d, i) {
    return ['translate(', 33 * i, ',', 50,')'].join('');
});

items.append('circle')
.attr("r", function (d) {
    return d / 9;
});

items.append('text').text(String);

console.debug('items', items);

function createSVG() {
    var svg = d3.select('#playground').selectAll('svg').data([0]);
    return svg.enter().append('svg').attr('viewBox', '0 0 100 100');
}

