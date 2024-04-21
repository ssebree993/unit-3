//begin script when window loads
window.onload = setMap();

//Example 1.3 line 4...set up choropleth map
function setMap() {
    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3
        .select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on United States
    var projection = d3
        .geoAlbers()
        .center([-18.18, 51.78])
        .rotate([84.64, 11.82, 0])    
        .parallels([30.18, 27.00])    
        .scale(900)    
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/CoTxBaby.csv"),
        d3.json("data/States2.topojson"),
        d3.json("data/County.topojson"),
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            state = data[1],
            county = data[2];

        //translate europe TopoJSON
        var states = topojson.feature(state, state.objects.States2),
            countys = topojson.feature(county, county.objects.County).features;

        //add States to map
        //var st = map
            //.append("path")
            //.datum(states)
            //.attr("class", "states")
            //.attr("d", path);

        //add Counties to map
        var co = map
            .selectAll(".co")
            .data(countys)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "county: " + d.properties.NAME;
            })
            .attr("d", path);
    }
}
