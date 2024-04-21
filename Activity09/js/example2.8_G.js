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
        d3.json("data/us_states_20m.topojson"),
        d3.json("data/us_county_20m.topojson"),
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            state = data[1],
            county = data[2];

        //translate europe TopoJSON
        var states = topojson.feature(state, state.objects.us_states_20m),
            countys = topojson.feature(county, county.objects.us_county_20m).features;

            var graticule = d3.geoGraticule().step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

            //create graticule background
            var gratBackground = map
                .append("path")
                .datum(graticule.outline()) //bind graticule background
                .attr("class", "gratBackground") //assign class for styling
                .attr("d", path); //project graticule
    
            //create graticule lines
            var gratLines = map
                .selectAll(".gratLines") //select graticule elements that will be created
                .data(graticule.lines()) //bind graticule lines to each element to be created
                .enter() //create an element for each datum
                .append("path") //append each element to the svg as a path element
                .attr("class", "gratLines") //assign class for styling
                .attr("d", path); //project graticule lines
                
        //add States to map
        var st = map
            .append("path")
            .datum(states)
            .attr("class", "states")
            .attr("d", path);

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
