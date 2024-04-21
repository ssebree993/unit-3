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

    //create Albers equal area conic projection centered on Oklahoma - uwCartLab D3 
    var projection = d3
        .geoAlbers()
        .center([-1.82, 19.96])
        .rotate([97.36, -20.91, 0])
        .parallels([20.00, 26.64])
        .scale(1487.88)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/OK_Sm.csv"),
        d3.json("data/OKr.topojson"),
        //d3.json("data/OKc.topojson"),
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            state = data[1],
            county = data[2];

        //translate europe TopoJSON
            //translate europe TopoJSON
            //var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries),
            //franceRegions = topojson.feature(france, france.objects.FranceRegions).features;
        var states = topojson.feature(state, state.objects.OKr),
            countys = topojson.feature(county, county.objects.OKc).features;

        //add OK State to map
        var  okies = map
            .append("path")
            .datum(states)
            .attr("class", "okies")
            .attr("d", path);

        //add OK Counties to map Shows all, but only label top 15
        var cous = map
            .selectAll(".cous")
            .data(countys)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "countys " + d.properties.FIPS;
            })
            .attr("d", path);
    }
}