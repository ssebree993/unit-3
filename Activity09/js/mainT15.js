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
        .translate([width/2, height/2])
        .scale([1000]);

    var path = d3.geoPath().projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/CoTxBaby.csv"),
        d3.json("data/States_Top15.topojson"),
        
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            state = data[1]            

        //translate europe TopoJSON
        var states = topojson.feature(state, state.objects.States_Top15)
            
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
            .attr("d", path)

    }
}
