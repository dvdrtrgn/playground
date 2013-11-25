var flat = flatten($data), avg=average(flat);
var deviations = flat.map(function(n){ return Math.pow(n-avg,2) });
var maxDev = Math.max.apply(Math,deviations);

var table = d3.select('#playground').selectAll('table').data([0]);
  table.enter().append('table');
  
var trs = table.selectAll('tr').data($data);
  trs.enter().append('tr'); trs.exit().remove();

var tds = trs.selectAll('td').data(I);
  tds.enter().append('td');
  tds.style('background',function(n){
      var rgb = Math.round(255*(1-Math.pow(n-avg,2)/maxDev));
      return "rgb(255,"+rgb+","+rgb+")";
    })
	  .text(ƒ('toFixed',1));

function flatten(matrix){
  return matrix.reduce(function(a,b){
    return a.concat(b);
  });
}

function average(a){
  var sum=0; a.forEach(function(n){sum+=n});
  return sum/a.length;
}
