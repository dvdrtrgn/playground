/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function _init() {
    var w = 1280,
        h = 800;
    var nodes = d3.range(200).map(

    function () {
        return {
            radius: Math.random() * 12 + 4
        };
    }),
        color = d3.scale.category10();
    var force = d3.layout.force().gravity(0.05).charge(

    function (d, i) {
        return i ? 0 : - 2000;
    }).nodes(nodes).size([w, h]);
    var root = nodes[0];
    root.radius = 0;
    root.fixed = true;
    force.start();
    var svg = d3.select("#playground").append("svg:svg").attr("width", w).attr("height", h);
    svg.selectAll("circle").data(nodes.slice(1)).enter().append("svg:circle").attr("r", function (d) {
        return d.radius - 2;
    }).style("fill", function (d, i) {
        return color(i % 3);
    });
    force.on("tick", function (e) {
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;
        while (++i < n) {
            q.visit(collide(nodes[i]));
        }
        svg.selectAll("circle").attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        });
    });
    svg.on("mousemove", function () {
        var p1 = d3.svg.mouse(this);
        root.px = p1[0];
        root.py = p1[1];
        force.resume();
    });

    function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function () {
    d3.geom = {};
    /**
     * Computes a contour for a given input grid function using the <a
     * href="http://en.wikipedia.org/wiki/Marching_squares">marching
     * squares</a> algorithm. Returns the contour polygon as an array of points.
     *
     * @param grid a two-input function(x, y) that returns true for values
     * inside the contour and false for values outside the contour.
     * @param start an optional starting point [x, y] on the grid.
     * @returns polygon [[x1, y1], [x2, y2], …]
     */
d3.geom.contour=function(grid,start){var s=start||d3_geom_contourStart(grid),c=[],x=s[0],y=s[1],dx=0,dy=0,pdx=NaN,pdy=NaN,i=0;do{i=0;if(grid(x-1,y-1))i+=1;if(grid(x,y-1))i+=2;if(grid(x-1,y))i+=4;if(grid(x,y))i+=8;if(i===6){dx=pdy===-1?-1:1;dy=0;}else if(i===9){dx=0;dy=pdx===1?-1:1;}else{dx=d3_geom_contourDx[i];dy=d3_geom_contourDy[i];}
if(dx!=pdx&&dy!=pdy){c.push([x,y]);pdx=dx;pdy=dy;}
x+=dx;y+=dy;}while(s[0]!=x||s[1]!=y);return c;};var d3_geom_contourDx=[1,0,1,1,-1,0,-1,1,0,0,0,0,-1,0,-1,NaN],d3_geom_contourDy=[0,-1,0,0,0,-1,0,0,1,-1,1,1,0,-1,0,NaN];function d3_geom_contourStart(grid){var x=0,y=0;while(true){if(grid(x,y)){return[x,y];}
if(x===0){x=y+1;y=0;}else{x=x-1;y=y+1;}}}
d3.geom.hull=function(vertices){if(vertices.length<3)return[];var len=vertices.length,plen=len-1,points=[],stack=[],i,j,h=0,x1,y1,x2,y2,u,v,a,sp;for(i=1;i<len;++i){if(vertices[i][1]<vertices[h][1]){h=i;}else if(vertices[i][1]==vertices[h][1]){h=(vertices[i][0]<vertices[h][0]?i:h);}}
for(i=0;i<len;++i){if(i===h)continue;y1=vertices[i][1]-vertices[h][1];x1=vertices[i][0]-vertices[h][0];points.push({angle:Math.atan2(y1,x1),index:i});}
points.sort(function(a,b){return a.angle-b.angle;});a=points[0].angle;v=points[0].index;u=0;for(i=1;i<plen;++i){j=points[i].index;if(a==points[i].angle){x1=vertices[v][0]-vertices[h][0];y1=vertices[v][1]-vertices[h][1];x2=vertices[j][0]-vertices[h][0];y2=vertices[j][1]-vertices[h][1];if((x1*x1+y1*y1)>=(x2*x2+y2*y2)){points[i].index=-1;}else{points[u].index=-1;a=points[i].angle;u=i;v=j;}}else{a=points[i].angle;u=i;v=j;}}
stack.push(h);for(i=0,j=0;i<2;++j){if(points[j].index!==-1){stack.push(points[j].index);i++;}}
sp=stack.length;for(;j<plen;++j){if(points[j].index===-1)continue;while(!d3_geom_hullCCW(stack[sp-2],stack[sp-1],points[j].index,vertices)){--sp;}
stack[sp++]=points[j].index;}
var poly=[];for(i=0;i<sp;++i){poly.push(vertices[stack[i]]);}
return poly;}
function d3_geom_hullCCW(i1,i2,i3,v){var t,a,b,c,d,e,f;t=v[i1];a=t[0];b=t[1];t=v[i2];c=t[0];d=t[1];t=v[i3];e=t[0];f=t[1];return((f-b)*(c-a)-(d-b)*(e-a))>0;}
d3.geom.polygon=function(coordinates){coordinates.area=function(){var i=0,n=coordinates.length,a=coordinates[n-1][0]*coordinates[0][1],b=coordinates[n-1][1]*coordinates[0][0];while(++i<n){a+=coordinates[i-1][0]*coordinates[i][1];b+=coordinates[i-1][1]*coordinates[i][0];}
return(b-a)*.5;};coordinates.centroid=function(k){var i=-1,n=coordinates.length-1,x=0,y=0,a,b,c;if(!arguments.length)k=-1/(6*coordinates.area());while(++i<n){a=coordinates[i];b=coordinates[i+1];c=a[0]*b[1]-b[0]*a[1];x+=(a[0]+b[0])*c;y+=(a[1]+b[1])*c;}
return[x*k,y*k];};coordinates.clip=function(subject){var input,i=-1,n=coordinates.length,j,m,a=coordinates[n-1],b,c,d;while(++i<n){input=subject.slice();subject.length=0;b=coordinates[i];c=input[(m=input.length)-1];j=-1;while(++j<m){d=input[j];if(d3_geom_polygonInside(d,a,b)){if(!d3_geom_polygonInside(c,a,b)){subject.push(d3_geom_polygonIntersect(c,d,a,b));}
subject.push(d);}else if(d3_geom_polygonInside(c,a,b)){subject.push(d3_geom_polygonIntersect(c,d,a,b));}
c=d;}
a=b;}
return subject;};return coordinates;};function d3_geom_polygonInside(p,a,b){return(b[0]-a[0])*(p[1]-a[1])<(b[1]-a[1])*(p[0]-a[0]);}
function d3_geom_polygonIntersect(c,d,a,b){var x1=c[0],x2=d[0],x3=a[0],x4=b[0],y1=c[1],y2=d[1],y3=a[1],y4=b[1],x13=x1-x3,x21=x2-x1,x43=x4-x3,y13=y1-y3,y21=y2-y1,y43=y4-y3,ua=(x43*y13-y43*x13)/(y43*x21-x43*y21);return[x1+ua*x21,y1+ua*y21];}
d3.geom.voronoi=function(vertices){var polygons=vertices.map(function(){return[];});d3_voronoi_tessellate(vertices,function(e){var s1,s2,x1,x2,y1,y2;if(e.a===1&&e.b>=0){s1=e.ep.r;s2=e.ep.l;}else{s1=e.ep.l;s2=e.ep.r;}
if(e.a===1){y1=s1?s1.y:-1e6;x1=e.c-e.b*y1;y2=s2?s2.y:1e6;x2=e.c-e.b*y2;}else{x1=s1?s1.x:-1e6;y1=e.c-e.a*x1;x2=s2?s2.x:1e6;y2=e.c-e.a*x2;}
var v1=[x1,y1],v2=[x2,y2];polygons[e.region.l.index].push(v1,v2);polygons[e.region.r.index].push(v1,v2);});return polygons.map(function(polygon,i){var cx=vertices[i][0],cy=vertices[i][1];polygon.forEach(function(v){v.angle=Math.atan2(v[0]-cx,v[1]-cy);});return polygon.sort(function(a,b){return a.angle-b.angle;}).filter(function(d,i){return!i||(d.angle-polygon[i-1].angle>1e-10);});});};var d3_voronoi_opposite={"l":"r","r":"l"};function d3_voronoi_tessellate(vertices,callback){var Sites={list:vertices.map(function(v,i){return{index:i,x:v[0],y:v[1]};}).sort(function(a,b){return a.y<b.y?-1:a.y>b.y?1:a.x<b.x?-1:a.x>b.x?1:0;}),bottomSite:null};var EdgeList={list:[],leftEnd:null,rightEnd:null,init:function(){EdgeList.leftEnd=EdgeList.createHalfEdge(null,"l");EdgeList.rightEnd=EdgeList.createHalfEdge(null,"l");EdgeList.leftEnd.r=EdgeList.rightEnd;EdgeList.rightEnd.l=EdgeList.leftEnd;EdgeList.list.unshift(EdgeList.leftEnd,EdgeList.rightEnd);},createHalfEdge:function(edge,side){return{edge:edge,side:side,vertex:null,"l":null,"r":null};},insert:function(lb,he){he.l=lb;he.r=lb.r;lb.r.l=he;lb.r=he;},leftBound:function(p){var he=EdgeList.leftEnd;do{he=he.r;}while(he!=EdgeList.rightEnd&&Geom.rightOf(he,p));he=he.l;return he;},del:function(he){he.l.r=he.r;he.r.l=he.l;he.edge=null;},right:function(he){return he.r;},left:function(he){return he.l;},leftRegion:function(he){return he.edge==null?Sites.bottomSite:he.edge.region[he.side];},rightRegion:function(he){return he.edge==null?Sites.bottomSite:he.edge.region[d3_voronoi_opposite[he.side]];}};var Geom={bisect:function(s1,s2){var newEdge={region:{"l":s1,"r":s2},ep:{"l":null,"r":null}};var dx=s2.x-s1.x,dy=s2.y-s1.y,adx=dx>0?dx:-dx,ady=dy>0?dy:-dy;newEdge.c=s1.x*dx+s1.y*dy+(dx*dx+dy*dy)*.5;if(adx>ady){newEdge.a=1;newEdge.b=dy/dx;newEdge.c/=dx;}else{newEdge.b=1;newEdge.a=dx/dy;newEdge.c/=dy;}
return newEdge;},intersect:function(el1,el2){var e1=el1.edge,e2=el2.edge;if(!e1||!e2||(e1.region.r==e2.region.r)){return null;}
var d=(e1.a*e2.b)-(e1.b*e2.a);if(Math.abs(d)<1e-10){return null;}
var xint=(e1.c*e2.b-e2.c*e1.b)/d,yint=(e2.c*e1.a-e1.c*e2.a)/d,e1r=e1.region.r,e2r=e2.region.r,el,e;if((e1r.y<e2r.y)||(e1r.y==e2r.y&&e1r.x<e2r.x)){el=el1;e=e1;}else{el=el2;e=e2;}
var rightOfSite=(xint>=e.region.r.x);if((rightOfSite&&(el.side==="l"))||(!rightOfSite&&(el.side==="r"))){return null;}
return{x:xint,y:yint};},rightOf:function(he,p){var e=he.edge,topsite=e.region.r,rightOfSite=(p.x>topsite.x);if(rightOfSite&&(he.side==="l")){return 1;}
if(!rightOfSite&&(he.side==="r")){return 0;}
if(e.a===1){var dyp=p.y-topsite.y,dxp=p.x-topsite.x,fast=0,above=0;if((!rightOfSite&&(e.b<0))||(rightOfSite&&(e.b>=0))){above=fast=(dyp>=e.b*dxp);}else{above=((p.x+p.y*e.b)>e.c);if(e.b<0){above=!above;}
if(!above){fast=1;}}
if(!fast){var dxs=topsite.x-e.region.l.x;above=(e.b*(dxp*dxp-dyp*dyp))<(dxs*dyp*(1+2*dxp/dxs+e.b*e.b));if(e.b<0){above=!above;}}}else
{var yl=e.c-e.a*p.x,t1=p.y-yl,t2=p.x-topsite.x,t3=yl-topsite.y;above=(t1*t1)>(t2*t2+t3*t3);}
return he.side==="l"?above:!above;},endPoint:function(edge,side,site){edge.ep[side]=site;if(!edge.ep[d3_voronoi_opposite[side]])return;callback(edge);},distance:function(s,t){var dx=s.x-t.x,dy=s.y-t.y;return Math.sqrt(dx*dx+dy*dy);}};var EventQueue={list:[],insert:function(he,site,offset){he.vertex=site;he.ystar=site.y+offset;for(var i=0,list=EventQueue.list,l=list.length;i<l;i++){var next=list[i];if(he.ystar>next.ystar||(he.ystar==next.ystar&&site.x>next.vertex.x)){continue;}else{break;}}
list.splice(i,0,he);},del:function(he){for(var i=0,ls=EventQueue.list,l=ls.length;i<l&&(ls[i]!=he);++i){}
ls.splice(i,1);},empty:function(){return EventQueue.list.length===0;},nextEvent:function(he){for(var i=0,ls=EventQueue.list,l=ls.length;i<l;++i){if(ls[i]==he)return ls[i+1];}
return null;},min:function(){var elem=EventQueue.list[0];return{x:elem.vertex.x,y:elem.ystar};},extractMin:function(){return EventQueue.list.shift();}};EdgeList.init();Sites.bottomSite=Sites.list.shift();var newSite=Sites.list.shift(),newIntStar;var lbnd,rbnd,llbnd,rrbnd,bisector;var bot,top,temp,p,v;var e,pm;while(true){if(!EventQueue.empty()){newIntStar=EventQueue.min();}
if(newSite&&(EventQueue.empty()||newSite.y<newIntStar.y||(newSite.y==newIntStar.y&&newSite.x<newIntStar.x))){lbnd=EdgeList.leftBound(newSite);rbnd=EdgeList.right(lbnd);bot=EdgeList.rightRegion(lbnd);e=Geom.bisect(bot,newSite);bisector=EdgeList.createHalfEdge(e,"l");EdgeList.insert(lbnd,bisector);p=Geom.intersect(lbnd,bisector);if(p){EventQueue.del(lbnd);EventQueue.insert(lbnd,p,Geom.distance(p,newSite));}
lbnd=bisector;bisector=EdgeList.createHalfEdge(e,"r");EdgeList.insert(lbnd,bisector);p=Geom.intersect(bisector,rbnd);if(p){EventQueue.insert(bisector,p,Geom.distance(p,newSite));}
newSite=Sites.list.shift();}else if(!EventQueue.empty()){lbnd=EventQueue.extractMin();llbnd=EdgeList.left(lbnd);rbnd=EdgeList.right(lbnd);rrbnd=EdgeList.right(rbnd);bot=EdgeList.leftRegion(lbnd);top=EdgeList.rightRegion(rbnd);v=lbnd.vertex;Geom.endPoint(lbnd.edge,lbnd.side,v);Geom.endPoint(rbnd.edge,rbnd.side,v);EdgeList.del(lbnd);EventQueue.del(rbnd);EdgeList.del(rbnd);pm="l";if(bot.y>top.y){temp=bot;bot=top;top=temp;pm="r";}
e=Geom.bisect(bot,top);bisector=EdgeList.createHalfEdge(e,pm);EdgeList.insert(llbnd,bisector);Geom.endPoint(e,d3_voronoi_opposite[pm],v);p=Geom.intersect(llbnd,bisector);if(p){EventQueue.del(llbnd);EventQueue.insert(llbnd,p,Geom.distance(p,bot));}
p=Geom.intersect(bisector,rrbnd);if(p){EventQueue.insert(bisector,p,Geom.distance(p,bot));}}else{break;}}
for(lbnd=EdgeList.right(EdgeList.leftEnd);lbnd!=EdgeList.rightEnd;lbnd=EdgeList.right(lbnd)){callback(lbnd.edge);}}
d3.geom.delaunay=function(vertices){var edges=vertices.map(function(){return[];}),triangles=[];d3_voronoi_tessellate(vertices,function(e){edges[e.region.l.index].push(vertices[e.region.r.index]);});edges.forEach(function(edge,i){var v=vertices[i],cx=v[0],cy=v[1];edge.forEach(function(v){v.angle=Math.atan2(v[0]-cx,v[1]-cy);});edge.sort(function(a,b){return a.angle-b.angle;});for(var j=0,m=edge.length-1;j<m;j++){triangles.push([v,edge[j],edge[j+1]]);}});return triangles;};d3.geom.quadtree=function(points,x1,y1,x2,y2){var p,i=-1,n=points.length;if(n&&isNaN(points[0].x))points=points.map(d3_geom_quadtreePoint);if(arguments.length<5){if(arguments.length===3){y2=x2=y1;y1=x1;}else{x1=y1=Infinity;x2=y2=-Infinity;while(++i<n){p=points[i];if(p.x<x1)x1=p.x;if(p.y<y1)y1=p.y;if(p.x>x2)x2=p.x;if(p.y>y2)y2=p.y;}
var dx=x2-x1,dy=y2-y1;if(dx>dy)y2=y1+dx;else x2=x1+dy;}}
function insert(n,p,x1,y1,x2,y2){if(isNaN(p.x)||isNaN(p.y))return;if(n.leaf){var v=n.point;if(v){if((Math.abs(v.x-p.x)+Math.abs(v.y-p.y))<.01){insertChild(n,p,x1,y1,x2,y2);}else{n.point=null;insertChild(n,v,x1,y1,x2,y2);insertChild(n,p,x1,y1,x2,y2);}}else{n.point=p;}}else{insertChild(n,p,x1,y1,x2,y2);}}
function insertChild(n,p,x1,y1,x2,y2){var sx=(x1+x2)*.5,sy=(y1+y2)*.5,right=p.x>=sx,bottom=p.y>=sy,i=(bottom<<1)+right;n.leaf=false;n=n.nodes[i]||(n.nodes[i]=d3_geom_quadtreeNode());if(right)x1=sx;else x2=sx;if(bottom)y1=sy;else y2=sy;insert(n,p,x1,y1,x2,y2);}
var root=d3_geom_quadtreeNode();root.add=function(p){insert(root,p,x1,y1,x2,y2);};root.visit=function(f){d3_geom_quadtreeVisit(f,root,x1,y1,x2,y2);};points.forEach(root.add);return root;};function d3_geom_quadtreeNode(){return{leaf:true,nodes:[],point:null};}
function d3_geom_quadtreeVisit(f,node,x1,y1,x2,y2){if(!f(node,x1,y1,x2,y2)){var sx=(x1+x2)*.5,sy=(y1+y2)*.5,children=node.nodes;if(children[0])d3_geom_quadtreeVisit(f,children[0],x1,y1,sx,sy);if(children[1])d3_geom_quadtreeVisit(f,children[1],sx,y1,x2,sy);if(children[2])d3_geom_quadtreeVisit(f,children[2],x1,sy,sx,y2);if(children[3])d3_geom_quadtreeVisit(f,children[3],sx,sy,x2,y2);}}
function d3_geom_quadtreePoint(p){return{x:p[0],y:p[1]};}
})();


(function () {
    d3.layout = {};
    // Implements hierarchical edge bundling using Holten's algorithm. For each
    // input link, a path is computed that travels through the tree, up the parent
    // hierarchy to the least common ancestor, and then back down to the destination
    // node. Each path is simply an array of nodes.
d3.layout.bundle=function(){return function(links){var paths=[],i=-1,n=links.length;while(++i<n)paths.push(d3_layout_bundlePath(links[i]));return paths;};};function d3_layout_bundlePath(link){var start=link.source,end=link.target,lca=d3_layout_bundleLeastCommonAncestor(start,end),points=[start];while(start!==lca){start=start.parent;points.push(start);}
var k=points.length;while(end!==lca){points.splice(k,0,end);end=end.parent;}
return points;}
function d3_layout_bundleAncestors(node){var ancestors=[],parent=node.parent;while(parent!=null){ancestors.push(node);node=parent;parent=parent.parent;}
ancestors.push(node);return ancestors;}
function d3_layout_bundleLeastCommonAncestor(a,b){if(a===b)return a;var aNodes=d3_layout_bundleAncestors(a),bNodes=d3_layout_bundleAncestors(b),aNode=aNodes.pop(),bNode=bNodes.pop(),sharedNode=null;while(aNode===bNode){sharedNode=aNode;aNode=aNodes.pop();bNode=bNodes.pop();}
return sharedNode;}
d3.layout.chord=function(){var chord={},chords,groups,matrix,n,padding=0,sortGroups,sortSubgroups,sortChords;function relayout(){var subgroups={},groupSums=[],groupIndex=d3.range(n),subgroupIndex=[],k,x,x0,i,j;chords=[];groups=[];k=0,i=-1;while(++i<n){x=0,j=-1;while(++j<n){x+=matrix[i][j];}
groupSums.push(x);subgroupIndex.push(d3.range(n));k+=x;}
if(sortGroups){groupIndex.sort(function(a,b){return sortGroups(groupSums[a],groupSums[b]);});}
if(sortSubgroups){subgroupIndex.forEach(function(d,i){d.sort(function(a,b){return sortSubgroups(matrix[i][a],matrix[i][b]);});});}
k=(2*Math.PI-padding*n)/k;x=0,i=-1;while(++i<n){x0=x,j=-1;while(++j<n){var di=groupIndex[i],dj=subgroupIndex[i][j],v=matrix[di][dj];subgroups[di+"-"+dj]={index:di,subindex:dj,startAngle:x,endAngle:x+=v*k,value:v};}
groups.push({index:di,startAngle:x0,endAngle:x,value:(x-x0)/k});x+=padding;}
i=-1;while(++i<n){j=i-1;while(++j<n){var source=subgroups[i+"-"+j],target=subgroups[j+"-"+i];if(source.value||target.value){chords.push(source.value<target.value?{source:target,target:source}:{source:source,target:target});}}}
if(sortChords)resort();}
function resort(){chords.sort(function(a,b){return sortChords(a.target.value,b.target.value);});}
chord.matrix=function(x){if(!arguments.length)return matrix;n=(matrix=x)&&matrix.length;chords=groups=null;return chord;};chord.padding=function(x){if(!arguments.length)return padding;padding=x;chords=groups=null;return chord;};chord.sortGroups=function(x){if(!arguments.length)return sortGroups;sortGroups=x;chords=groups=null;return chord;};chord.sortSubgroups=function(x){if(!arguments.length)return sortSubgroups;sortSubgroups=x;chords=null;return chord;};chord.sortChords=function(x){if(!arguments.length)return sortChords;sortChords=x;if(chords)resort();return chord;};chord.chords=function(){if(!chords)relayout();return chords;};chord.groups=function(){if(!groups)relayout();return groups;};return chord;};d3.layout.force=function(){var force={},event=d3.dispatch("tick"),size=[1,1],drag,alpha,friction=.9,linkDistance=d3_layout_forceLinkDistance,linkStrength=d3_layout_forceLinkStrength,charge=-30,gravity=.1,theta=.8,interval,nodes=[],links=[],distances,strengths,charges;function repulse(node){return function(quad,x1,y1,x2,y2){if(quad.point!==node){var dx=quad.cx-node.x,dy=quad.cy-node.y,dn=1/Math.sqrt(dx*dx+dy*dy);if((x2-x1)*dn<theta){var k=quad.charge*dn*dn;node.px-=dx*k;node.py-=dy*k;return true;}
if(quad.point&&isFinite(dn)){var k=quad.pointCharge*dn*dn;node.px-=dx*k;node.py-=dy*k;}}
return!quad.charge;};}
function tick(){var n=nodes.length,m=links.length,q,i,o,s,t,l,k,x,y;for(i=0;i<m;++i){o=links[i];s=o.source;t=o.target;x=t.x-s.x;y=t.y-s.y;if(l=(x*x+y*y)){l=alpha*strengths[i]*((l=Math.sqrt(l))-distances[i])/l;x*=l;y*=l;t.x-=x*(k=s.weight/(t.weight+s.weight));t.y-=y*k;s.x+=x*(k=1-k);s.y+=y*k;}}
if(k=alpha*gravity){x=size[0]/2;y=size[1]/2;i=-1;if(k)while(++i<n){o=nodes[i];o.x+=(x-o.x)*k;o.y+=(y-o.y)*k;}}
if(charge){d3_layout_forceAccumulate(q=d3.geom.quadtree(nodes),alpha,charges);i=-1;while(++i<n){if(!(o=nodes[i]).fixed){q.visit(repulse(o));}}}
i=-1;while(++i<n){o=nodes[i];if(o.fixed){o.x=o.px;o.y=o.py;}else{o.x-=(o.px-(o.px=o.x))*friction;o.y-=(o.py-(o.py=o.y))*friction;}}
event.tick.dispatch({type:"tick",alpha:alpha});return(alpha*=.99)<.005;}
force.on=function(type,listener){event[type].add(listener);return force;};force.nodes=function(x){if(!arguments.length)return nodes;nodes=x;return force;};force.links=function(x){if(!arguments.length)return links;links=x;return force;};force.size=function(x){if(!arguments.length)return size;size=x;return force;};force.linkDistance=function(x){if(!arguments.length)return linkDistance;linkDistance=d3.functor(x);return force;};force.distance=force.linkDistance;force.linkStrength=function(x){if(!arguments.length)return linkStrength;linkStrength=d3.functor(x);return force;};force.friction=function(x){if(!arguments.length)return friction;friction=x;return force;};force.charge=function(x){if(!arguments.length)return charge;charge=typeof x==="function"?x:+x;return force;};force.gravity=function(x){if(!arguments.length)return gravity;gravity=x;return force;};force.theta=function(x){if(!arguments.length)return theta;theta=x;return force;};force.start=function(){var i,j,n=nodes.length,m=links.length,w=size[0],h=size[1],neighbors,o;for(i=0;i<n;++i){(o=nodes[i]).index=i;o.weight=0;}
distances=[];strengths=[];for(i=0;i<m;++i){o=links[i];if(typeof o.source=="number")o.source=nodes[o.source];if(typeof o.target=="number")o.target=nodes[o.target];distances[i]=linkDistance.call(this,o,i);strengths[i]=linkStrength.call(this,o,i);++o.source.weight;++o.target.weight;}
for(i=0;i<n;++i){o=nodes[i];if(isNaN(o.x))o.x=position("x",w);if(isNaN(o.y))o.y=position("y",h);if(isNaN(o.px))o.px=o.x;if(isNaN(o.py))o.py=o.y;}
charges=[];if(typeof charge==="function"){for(i=0;i<n;++i){charges[i]=+charge.call(this,nodes[i],i);}}else{for(i=0;i<n;++i){charges[i]=charge;}}
function position(dimension,size){var neighbors=neighbor(i),j=-1,m=neighbors.length,x;while(++j<m)if(!isNaN(x=neighbors[j][dimension]))return x;return Math.random()*size;}
function neighbor(){if(!neighbors){neighbors=[];for(j=0;j<n;++j){neighbors[j]=[];}
for(j=0;j<m;++j){var o=links[j];neighbors[o.source.index].push(o.target);neighbors[o.target.index].push(o.source);}}
return neighbors[i];}
return force.resume();};force.resume=function(){alpha=.1;d3.timer(tick);return force;};force.stop=function(){alpha=0;return force;};force.drag=function(){if(!drag)drag=d3.behavior.drag().on("dragstart",dragstart).on("drag",d3_layout_forceDrag).on("dragend",d3_layout_forceDragEnd);this.on("mouseover.force",d3_layout_forceDragOver).on("mouseout.force",d3_layout_forceDragOut).call(drag);};function dragstart(d){d3_layout_forceDragOver(d3_layout_forceDragNode=d);d3_layout_forceDragForce=force;}
return force;};var d3_layout_forceDragForce,d3_layout_forceDragNode;function d3_layout_forceDragOver(d){d.fixed|=2;}
function d3_layout_forceDragOut(d){if(d!==d3_layout_forceDragNode)d.fixed&=1;}
function d3_layout_forceDragEnd(){d3_layout_forceDrag();d3_layout_forceDragNode.fixed&=1;d3_layout_forceDragForce=d3_layout_forceDragNode=null;}
function d3_layout_forceDrag(){d3_layout_forceDragNode.px+=d3.event.dx;d3_layout_forceDragNode.py+=d3.event.dy;d3_layout_forceDragForce.resume();}
function d3_layout_forceAccumulate(quad,alpha,charges){var cx=0,cy=0;quad.charge=0;if(!quad.leaf){var nodes=quad.nodes,n=nodes.length,i=-1,c;while(++i<n){c=nodes[i];if(c==null)continue;d3_layout_forceAccumulate(c,alpha,charges);quad.charge+=c.charge;cx+=c.charge*c.cx;cy+=c.charge*c.cy;}}
if(quad.point){if(!quad.leaf){quad.point.x+=Math.random()-.5;quad.point.y+=Math.random()-.5;}
var k=alpha*charges[quad.point.index];quad.charge+=quad.pointCharge=k;cx+=k*quad.point.x;cy+=k*quad.point.y;}
quad.cx=cx/quad.charge;quad.cy=cy/quad.charge;}
function d3_layout_forceLinkDistance(link){return 20;}
function d3_layout_forceLinkStrength(link){return 1;}
d3.layout.partition=function(){var hierarchy=d3.layout.hierarchy(),size=[1,1];function position(node,x,dx,dy){var children=node.children;node.x=x;node.y=node.depth*dy;node.dx=dx;node.dy=dy;if(children&&(n=children.length)){var i=-1,n,c,d;dx=node.value?dx/node.value:0;while(++i<n){position(c=children[i],x,d=c.value*dx,dy);x+=d;}}}
function depth(node){var children=node.children,d=0;if(children&&(n=children.length)){var i=-1,n;while(++i<n)d=Math.max(d,depth(children[i]));}
return 1+d;}
function partition(d,i){var nodes=hierarchy.call(this,d,i);position(nodes[0],0,size[0],size[1]/depth(nodes[0]));return nodes;}
partition.size=function(x){if(!arguments.length)return size;size=x;return partition;};return d3_layout_hierarchyRebind(partition,hierarchy);};d3.layout.pie=function(){var value=Number,sort=null,startAngle=0,endAngle=2*Math.PI;function pie(data,i){var a=+(typeof startAngle==="function"?startAngle.apply(this,arguments):startAngle);var k=(typeof endAngle==="function"?endAngle.apply(this,arguments):endAngle)-startAngle;var index=d3.range(data.length);if(sort!=null)index.sort(function(i,j){return sort(data[i],data[j]);});var values=data.map(value);k/=values.reduce(function(p,d){return p+d;},0);var arcs=index.map(function(i){return{data:data[i],value:d=values[i],startAngle:a,endAngle:a+=d*k};});return data.map(function(d,i){return arcs[index[i]];});}
pie.value=function(x){if(!arguments.length)return value;value=x;return pie;};pie.sort=function(x){if(!arguments.length)return sort;sort=x;return pie;};pie.startAngle=function(x){if(!arguments.length)return startAngle;startAngle=x;return pie;};pie.endAngle=function(x){if(!arguments.length)return endAngle;endAngle=x;return pie;};return pie;};d3.layout.stack=function(){var values=Object,order=d3_layout_stackOrders["default"],offset=d3_layout_stackOffsets["zero"],out=d3_layout_stackOut,x=d3_layout_stackX,y=d3_layout_stackY;function stack(data,index){var series=data.map(function(d,i){return values.call(stack,d,i);});var points=series.map(function(d,i){return d.map(function(v,i){return[x.call(stack,v,i),y.call(stack,v,i)];});});var orders=order.call(stack,points,index);series=d3.permute(series,orders);points=d3.permute(points,orders);var offsets=offset.call(stack,points,index);var n=series.length,m=series[0].length,i,j,o;for(j=0;j<m;++j){out.call(stack,series[0][j],o=offsets[j],points[0][j][1]);for(i=1;i<n;++i){out.call(stack,series[i][j],o+=points[i-1][j][1],points[i][j][1]);}}
return data;}
stack.values=function(x){if(!arguments.length)return values;values=x;return stack;};stack.order=function(x){if(!arguments.length)return order;order=typeof x==="function"?x:d3_layout_stackOrders[x];return stack;};stack.offset=function(x){if(!arguments.length)return offset;offset=typeof x==="function"?x:d3_layout_stackOffsets[x];return stack;};stack.x=function(z){if(!arguments.length)return x;x=z;return stack;};stack.y=function(z){if(!arguments.length)return y;y=z;return stack;};stack.out=function(z){if(!arguments.length)return out;out=z;return stack;};return stack;}
function d3_layout_stackX(d){return d.x;}
function d3_layout_stackY(d){return d.y;}
function d3_layout_stackOut(d,y0,y){d.y0=y0;d.y=y;}
var d3_layout_stackOrders={"inside-out":function(data){var n=data.length,i,j,max=data.map(d3_layout_stackMaxIndex),sums=data.map(d3_layout_stackReduceSum),index=d3.range(n).sort(function(a,b){return max[a]-max[b];}),top=0,bottom=0,tops=[],bottoms=[];for(i=0;i<n;++i){j=index[i];if(top<bottom){top+=sums[j];tops.push(j);}else{bottom+=sums[j];bottoms.push(j);}}
return bottoms.reverse().concat(tops);},"reverse":function(data){return d3.range(data.length).reverse();},"default":function(data){return d3.range(data.length);}};var d3_layout_stackOffsets={"silhouette":function(data){var n=data.length,m=data[0].length,sums=[],max=0,i,j,o,y0=[];for(j=0;j<m;++j){for(i=0,o=0;i<n;i++)o+=data[i][j][1];if(o>max)max=o;sums.push(o);}
for(j=0;j<m;++j){y0[j]=(max-sums[j])/2;}
return y0;},"wiggle":function(data){var n=data.length,x=data[0],m=x.length,max=0,i,j,k,s1,s2,s3,dx,o,o0,y0=[];y0[0]=o=o0=0;for(j=1;j<m;++j){for(i=0,s1=0;i<n;++i)s1+=data[i][j][1];for(i=0,s2=0,dx=x[j][0]-x[j-1][0];i<n;++i){for(k=0,s3=(data[i][j][1]-data[i][j-1][1])/(2*dx);k<i;++k){s3+=(data[k][j][1]-data[k][j-1][1])/dx;}
s2+=s3*data[i][j][1];}
y0[j]=o-=s1?s2/s1*dx:0;if(o<o0)o0=o;}
for(j=0;j<m;++j)y0[j]-=o0;return y0;},"expand":function(data){var n=data.length,m=data[0].length,k=1/n,i,j,o,y0=[];for(j=0;j<m;++j){for(i=0,o=0;i<n;i++)o+=data[i][j][1];if(o)for(i=0;i<n;i++)data[i][j][1]/=o;else for(i=0;i<n;i++)data[i][j][1]=k;}
for(j=0;j<m;++j)y0[j]=0;return y0;},"zero":function(data){var j=-1,m=data[0].length,y0=[];while(++j<m)y0[j]=0;return y0;}};function d3_layout_stackMaxIndex(array){var i=1,j=0,v=array[0][1],k,n=array.length;for(;i<n;++i){if((k=array[i][1])>v){j=i;v=k;}}
return j;}
function d3_layout_stackReduceSum(d){return d.reduce(d3_layout_stackSum,0);}
function d3_layout_stackSum(p,d){return p+d[1];}
d3.layout.histogram=function(){var frequency=true,valuer=Number,ranger=d3_layout_histogramRange,binner=d3_layout_histogramBinSturges;function histogram(data,i){var bins=[],values=data.map(valuer,this),range=ranger.call(this,values,i),thresholds=binner.call(this,range,values,i),bin,i=-1,n=values.length,m=thresholds.length-1,k=frequency?1:1/n,x;while(++i<m){bin=bins[i]=[];bin.dx=thresholds[i+1]-(bin.x=thresholds[i]);bin.y=0;}
i=-1;while(++i<n){x=values[i];if((x>=range[0])&&(x<=range[1])){bin=bins[d3.bisect(thresholds,x,1,m)-1];bin.y+=k;bin.push(data[i]);}}
return bins;}
histogram.value=function(x){if(!arguments.length)return valuer;valuer=x;return histogram;};histogram.range=function(x){if(!arguments.length)return ranger;ranger=d3.functor(x);return histogram;};histogram.bins=function(x){if(!arguments.length)return binner;binner=typeof x==="number"?function(range){return d3_layout_histogramBinFixed(range,x);}:d3.functor(x);return histogram;};histogram.frequency=function(x){if(!arguments.length)return frequency;frequency=!!x;return histogram;};return histogram;};function d3_layout_histogramBinSturges(range,values){return d3_layout_histogramBinFixed(range,Math.ceil(Math.log(values.length)/Math.LN2+1));}
function d3_layout_histogramBinFixed(range,n){var x=-1,b=+range[0],m=(range[1]-b)/n,f=[];while(++x<=n)f[x]=m*x+b;return f;}
function d3_layout_histogramRange(values){return[d3.min(values),d3.max(values)];}
d3.layout.hierarchy=function(){var sort=d3_layout_hierarchySort,children=d3_layout_hierarchyChildren,value=d3_layout_hierarchyValue;function recurse(data,depth,nodes){var childs=children.call(hierarchy,data,depth),node=d3_layout_hierarchyInline?data:{data:data};node.depth=depth;nodes.push(node);if(childs&&(n=childs.length)){var i=-1,n,c=node.children=[],v=0,j=depth+1;while(++i<n){d=recurse(childs[i],j,nodes);d.parent=node;c.push(d);v+=d.value;}
if(sort)c.sort(sort);if(value)node.value=v;}else if(value){node.value=+value.call(hierarchy,data,depth)||0;}
return node;}
function revalue(node,depth){var children=node.children,v=0;if(children&&(n=children.length)){var i=-1,n,j=depth+1;while(++i<n)v+=revalue(children[i],j);}else if(value){v=+value.call(hierarchy,d3_layout_hierarchyInline?node:node.data,depth)||0;}
if(value)node.value=v;return v;}
function hierarchy(d){var nodes=[];recurse(d,0,nodes);return nodes;}
hierarchy.sort=function(x){if(!arguments.length)return sort;sort=x;return hierarchy;};hierarchy.children=function(x){if(!arguments.length)return children;children=x;return hierarchy;};hierarchy.value=function(x){if(!arguments.length)return value;value=x;return hierarchy;};hierarchy.revalue=function(root){revalue(root,0);return root;};return hierarchy;};function d3_layout_hierarchyRebind(object,hierarchy){object.sort=d3.rebind(object,hierarchy.sort);object.children=d3.rebind(object,hierarchy.children);object.links=d3_layout_hierarchyLinks;object.value=d3.rebind(object,hierarchy.value);object.nodes=function(d){d3_layout_hierarchyInline=true;return(object.nodes=object)(d);};return object;}
function d3_layout_hierarchyChildren(d){return d.children;}
function d3_layout_hierarchyValue(d){return d.value;}
function d3_layout_hierarchySort(a,b){return b.value-a.value;}
function d3_layout_hierarchyLinks(nodes){return d3.merge(nodes.map(function(parent){return(parent.children||[]).map(function(child){return{source:parent,target:child};});}));}
var d3_layout_hierarchyInline=false;d3.layout.pack=function(){var hierarchy=d3.layout.hierarchy().sort(d3_layout_packSort),size=[1,1];function pack(d,i){var nodes=hierarchy.call(this,d,i),root=nodes[0];root.x=0;root.y=0;d3_layout_packTree(root);var w=size[0],h=size[1],k=1/Math.max(2*root.r/w,2*root.r/h);d3_layout_packTransform(root,w/2,h/2,k);return nodes;}
pack.size=function(x){if(!arguments.length)return size;size=x;return pack;};return d3_layout_hierarchyRebind(pack,hierarchy);};function d3_layout_packSort(a,b){return a.value-b.value;}
function d3_layout_packInsert(a,b){var c=a._pack_next;a._pack_next=b;b._pack_prev=a;b._pack_next=c;c._pack_prev=b;}
function d3_layout_packSplice(a,b){a._pack_next=b;b._pack_prev=a;}
function d3_layout_packIntersects(a,b){var dx=b.x-a.x,dy=b.y-a.y,dr=a.r+b.r;return(dr*dr-dx*dx-dy*dy)>.001;}
function d3_layout_packCircle(nodes){var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity,n=nodes.length,a,b,c,j,k;function bound(node){xMin=Math.min(node.x-node.r,xMin);xMax=Math.max(node.x+node.r,xMax);yMin=Math.min(node.y-node.r,yMin);yMax=Math.max(node.y+node.r,yMax);}
nodes.forEach(d3_layout_packLink);a=nodes[0];a.x=-a.r;a.y=0;bound(a);if(n>1){b=nodes[1];b.x=b.r;b.y=0;bound(b);if(n>2){c=nodes[2];d3_layout_packPlace(a,b,c);bound(c);d3_layout_packInsert(a,c);a._pack_prev=c;d3_layout_packInsert(c,b);b=a._pack_next;for(var i=3;i<n;i++){d3_layout_packPlace(a,b,c=nodes[i]);var isect=0,s1=1,s2=1;for(j=b._pack_next;j!==b;j=j._pack_next,s1++){if(d3_layout_packIntersects(j,c)){isect=1;break;}}
if(isect==1){for(k=a._pack_prev;k!==j._pack_prev;k=k._pack_prev,s2++){if(d3_layout_packIntersects(k,c)){if(s2<s1){isect=-1;j=k;}
break;}}}
if(isect==0){d3_layout_packInsert(a,c);b=c;bound(c);}else if(isect>0){d3_layout_packSplice(a,j);b=j;i--;}else{d3_layout_packSplice(j,b);a=j;i--;}}}}
var cx=(xMin+xMax)/2,cy=(yMin+yMax)/2,cr=0;for(var i=0;i<n;i++){var node=nodes[i];node.x-=cx;node.y-=cy;cr=Math.max(cr,node.r+Math.sqrt(node.x*node.x+node.y*node.y));}
nodes.forEach(d3_layout_packUnlink);return cr;}
function d3_layout_packLink(node){node._pack_next=node._pack_prev=node;}
function d3_layout_packUnlink(node){delete node._pack_next;delete node._pack_prev;}
function d3_layout_packTree(node){var children=node.children;if(children&&children.length){children.forEach(d3_layout_packTree);node.r=d3_layout_packCircle(children);}else{node.r=Math.sqrt(node.value);}}
function d3_layout_packTransform(node,x,y,k){var children=node.children;node.x=(x+=k*node.x);node.y=(y+=k*node.y);node.r*=k;if(children){var i=-1,n=children.length;while(++i<n)d3_layout_packTransform(children[i],x,y,k);}}
function d3_layout_packPlace(a,b,c){var db=a.r+c.r,dx=b.x-a.x,dy=b.y-a.y;if(db&&(dx||dy)){var da=b.r+c.r,dc=Math.sqrt(dx*dx+dy*dy),cos=Math.max(-1,Math.min(1,(db*db+dc*dc-da*da)/(2*db*dc))),theta=Math.acos(cos),x=cos*(db/=dc),y=Math.sin(theta)*db;c.x=a.x+x*dx+y*dy;c.y=a.y+x*dy-y*dx;}else{c.x=a.x+db;c.y=a.y;}}
d3.layout.cluster=function(){var hierarchy=d3.layout.hierarchy().sort(null).value(null),separation=d3_layout_treeSeparation,size=[1,1];function cluster(d,i){var nodes=hierarchy.call(this,d,i),root=nodes[0],previousNode,x=0,kx,ky;d3_layout_treeVisitAfter(root,function(node){var children=node.children;if(children&&children.length){node.x=d3_layout_clusterX(children);node.y=d3_layout_clusterY(children);}else{node.x=previousNode?x+=separation(node,previousNode):0;node.y=0;previousNode=node;}});var left=d3_layout_clusterLeft(root),right=d3_layout_clusterRight(root),x0=left.x-separation(left,right)/2,x1=right.x+separation(right,left)/2;d3_layout_treeVisitAfter(root,function(node){node.x=(node.x-x0)/(x1-x0)*size[0];node.y=(1-node.y/root.y)*size[1];});return nodes;}
cluster.separation=function(x){if(!arguments.length)return separation;separation=x;return cluster;};cluster.size=function(x){if(!arguments.length)return size;size=x;return cluster;};return d3_layout_hierarchyRebind(cluster,hierarchy);};function d3_layout_clusterY(children){return 1+d3.max(children,function(child){return child.y;});}
function d3_layout_clusterX(children){return children.reduce(function(x,child){return x+child.x;},0)/children.length;}
function d3_layout_clusterLeft(node){var children=node.children;return children&&children.length?d3_layout_clusterLeft(children[0]):node;}
function d3_layout_clusterRight(node){var children=node.children,n;return children&&(n=children.length)?d3_layout_clusterRight(children[n-1]):node;}
d3.layout.tree=function(){var hierarchy=d3.layout.hierarchy().sort(null).value(null),separation=d3_layout_treeSeparation,size=[1,1];function tree(d,i){var nodes=hierarchy.call(this,d,i),root=nodes[0];function firstWalk(node,previousSibling){var children=node.children,layout=node._tree;if(children&&(n=children.length)){var n,firstChild=children[0],previousChild,ancestor=firstChild,child,i=-1;while(++i<n){child=children[i];firstWalk(child,previousChild);ancestor=apportion(child,previousChild,ancestor);previousChild=child;}
d3_layout_treeShift(node);var midpoint=.5*(firstChild._tree.prelim+child._tree.prelim);if(previousSibling){layout.prelim=previousSibling._tree.prelim+separation(node,previousSibling);layout.mod=layout.prelim-midpoint;}else{layout.prelim=midpoint;}}else{if(previousSibling){layout.prelim=previousSibling._tree.prelim+separation(node,previousSibling);}}}
function secondWalk(node,x){node.x=node._tree.prelim+x;var children=node.children;if(children&&(n=children.length)){var i=-1,n;x+=node._tree.mod;while(++i<n){secondWalk(children[i],x);}}}
function apportion(node,previousSibling,ancestor){if(previousSibling){var vip=node,vop=node,vim=previousSibling,vom=node.parent.children[0],sip=vip._tree.mod,sop=vop._tree.mod,sim=vim._tree.mod,som=vom._tree.mod,shift;while(vim=d3_layout_treeRight(vim),vip=d3_layout_treeLeft(vip),vim&&vip){vom=d3_layout_treeLeft(vom);vop=d3_layout_treeRight(vop);vop._tree.ancestor=node;shift=vim._tree.prelim+sim-vip._tree.prelim-sip+separation(vim,vip);if(shift>0){d3_layout_treeMove(d3_layout_treeAncestor(vim,node,ancestor),node,shift);sip+=shift;sop+=shift;}
sim+=vim._tree.mod;sip+=vip._tree.mod;som+=vom._tree.mod;sop+=vop._tree.mod;}
if(vim&&!d3_layout_treeRight(vop)){vop._tree.thread=vim;vop._tree.mod+=sim-sop;}
if(vip&&!d3_layout_treeLeft(vom)){vom._tree.thread=vip;vom._tree.mod+=sip-som;ancestor=node;}}
return ancestor;}
d3_layout_treeVisitAfter(root,function(node,previousSibling){node._tree={ancestor:node,prelim:0,mod:0,change:0,shift:0,number:previousSibling?previousSibling._tree.number+1:0};});firstWalk(root);secondWalk(root,-root._tree.prelim);var left=d3_layout_treeSearch(root,d3_layout_treeLeftmost),right=d3_layout_treeSearch(root,d3_layout_treeRightmost),deep=d3_layout_treeSearch(root,d3_layout_treeDeepest),x0=left.x-separation(left,right)/2,x1=right.x+separation(right,left)/2,y1=deep.depth||1;d3_layout_treeVisitAfter(root,function(node){node.x=(node.x-x0)/(x1-x0)*size[0];node.y=node.depth/y1*size[1];delete node._tree;});return nodes;}
tree.separation=function(x){if(!arguments.length)return separation;separation=x;return tree;};tree.size=function(x){if(!arguments.length)return size;size=x;return tree;};return d3_layout_hierarchyRebind(tree,hierarchy);};function d3_layout_treeSeparation(a,b){return a.parent==b.parent?1:2;}
function d3_layout_treeLeft(node){var children=node.children;return children&&children.length?children[0]:node._tree.thread;}
function d3_layout_treeRight(node){var children=node.children,n;return children&&(n=children.length)?children[n-1]:node._tree.thread;}
function d3_layout_treeSearch(node,compare){var children=node.children;if(children&&(n=children.length)){var child,n,i=-1;while(++i<n){if(compare(child=d3_layout_treeSearch(children[i],compare),node)>0){node=child;}}}
return node;}
function d3_layout_treeRightmost(a,b){return a.x-b.x;}
function d3_layout_treeLeftmost(a,b){return b.x-a.x;}
function d3_layout_treeDeepest(a,b){return a.depth-b.depth;}
function d3_layout_treeVisitAfter(node,callback){function visit(node,previousSibling){var children=node.children;if(children&&(n=children.length)){var child,previousChild=null,i=-1,n;while(++i<n){child=children[i];visit(child,previousChild);previousChild=child;}}
callback(node,previousSibling);}
visit(node,null);}
function d3_layout_treeShift(node){var shift=0,change=0,children=node.children,i=children.length,child;while(--i>=0){child=children[i]._tree;child.prelim+=shift;child.mod+=shift;shift+=child.shift+(change+=child.change);}}
function d3_layout_treeMove(ancestor,node,shift){ancestor=ancestor._tree;node=node._tree;var change=shift/(node.number-ancestor.number);ancestor.change+=change;node.change-=change;node.shift+=shift;node.prelim+=shift;node.mod+=shift;}
function d3_layout_treeAncestor(vim,node,ancestor){return vim._tree.ancestor.parent==node.parent?vim._tree.ancestor:ancestor;}
d3.layout.treemap=function(){var hierarchy=d3.layout.hierarchy(),round=Math.round,size=[1,1],padding=null,pad=d3_layout_treemapPadNull,sticky=false,stickies,ratio=0.5*(1+Math.sqrt(5));function scale(children,k){var i=-1,n=children.length,child,area;while(++i<n){area=(child=children[i]).value*(k<0?0:k);child.area=isNaN(area)||area<=0?0:area;}}
function squarify(node){var children=node.children;if(children&&children.length){var rect=pad(node),row=[],remaining=children.slice(),child,best=Infinity,score,u=Math.min(rect.dx,rect.dy),n;scale(remaining,rect.dx*rect.dy/node.value);row.area=0;while((n=remaining.length)>0){row.push(child=remaining[n-1]);row.area+=child.area;if((score=worst(row,u))<=best){remaining.pop();best=score;}else{row.area-=row.pop().area;position(row,u,rect,false);u=Math.min(rect.dx,rect.dy);row.length=row.area=0;best=Infinity;}}
if(row.length){position(row,u,rect,true);row.length=row.area=0;}
children.forEach(squarify);}}
function stickify(node){var children=node.children;if(children&&children.length){var rect=pad(node),remaining=children.slice(),child,row=[];scale(remaining,rect.dx*rect.dy/node.value);row.area=0;while(child=remaining.pop()){row.push(child);row.area+=child.area;if(child.z!=null){position(row,child.z?rect.dx:rect.dy,rect,!remaining.length);row.length=row.area=0;}}
children.forEach(stickify);}}
function worst(row,u){var s=row.area,r,rmax=0,rmin=Infinity,i=-1,n=row.length;while(++i<n){if(!(r=row[i].area))continue;if(r<rmin)rmin=r;if(r>rmax)rmax=r;}
s*=s;u*=u;return s?Math.max((u*rmax*ratio)/s,s/(u*rmin*ratio)):Infinity;}
function position(row,u,rect,flush){var i=-1,n=row.length,x=rect.x,y=rect.y,v=u?round(row.area/u):0,o;if(u==rect.dx){if(flush||v>rect.dy)v=v?rect.dy:0;while(++i<n){o=row[i];o.x=x;o.y=y;o.dy=v;x+=o.dx=v?round(o.area/v):0;}
o.z=true;o.dx+=rect.x+rect.dx-x;rect.y+=v;rect.dy-=v;}else{if(flush||v>rect.dx)v=v?rect.dx:0;while(++i<n){o=row[i];o.x=x;o.y=y;o.dx=v;y+=o.dy=v?round(o.area/v):0;}
o.z=false;o.dy+=rect.y+rect.dy-y;rect.x+=v;rect.dx-=v;}}
function treemap(d){var nodes=stickies||hierarchy(d),root=nodes[0];root.x=0;root.y=0;root.dx=size[0];root.dy=size[1];if(stickies)hierarchy.revalue(root);scale([root],root.dx*root.dy/root.value);(stickies?stickify:squarify)(root);if(sticky)stickies=nodes;return nodes;}
treemap.size=function(x){if(!arguments.length)return size;size=x;return treemap;};treemap.padding=function(x){if(!arguments.length)return padding;function padFunction(node){var p=x.call(treemap,node,node.depth);return p==null?d3_layout_treemapPadNull(node):d3_layout_treemapPad(node,typeof p==="number"?[p,p,p,p]:p);}
function padConstant(node){return d3_layout_treemapPad(node,x);}
var type;pad=(padding=x)==null?d3_layout_treemapPadNull:(type=typeof x)==="function"?padFunction:type==="number"?(x=[x,x,x,x],padConstant):padConstant;return treemap;};treemap.round=function(x){if(!arguments.length)return round!=Number;round=x?Math.round:Number;return treemap;};treemap.sticky=function(x){if(!arguments.length)return sticky;sticky=x;stickies=null;return treemap;};treemap.ratio=function(x){if(!arguments.length)return ratio;ratio=x;return treemap;};return d3_layout_hierarchyRebind(treemap,hierarchy);};function d3_layout_treemapPadNull(node){return{x:node.x,y:node.y,dx:node.dx,dy:node.dy};}
function d3_layout_treemapPad(node,padding){var x=node.x+padding[3],y=node.y+padding[0],dx=node.dx-padding[1]-padding[3],dy=node.dy-padding[0]-padding[2];if(dx<0){x+=dx/2;dx=0;}
if(dy<0){y+=dy/2;dy=0;}
return{x:x,y:y,dx:dx,dy:dy};}
})();


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
_init();
