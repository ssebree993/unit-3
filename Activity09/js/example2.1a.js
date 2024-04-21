//Example 1.4 line 1...set up choropleth map
function setMap(){

    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on Oklahoma - uwCartLab D3 
    var projection = d3.geo.albers()
        .center([-1.82, 19.96])
        .rotate([97.36, -20.91, 0])
        .parallels([20.00, 26.64])
        .scale(1487.88)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);
    

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];    
    promises.push(d3.csv("data/OK_Sm.csv")); //load attributes from csv    
    promises.push(d3.json("data/OKr.topojson")); //load background spatial data    
    promises.push(d3.json("data/OKc.topojson")); //load choropleth spatial data    
    Promise.all(promises).then(callback);
    
}