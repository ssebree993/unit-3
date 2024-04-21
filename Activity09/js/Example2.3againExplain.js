//Example 1.5 line 1
function callback(data){               

    ...
       //translate europe TopoJSON
       var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries), //translate TopoJSON
           franceRegions = topojson.feature(france, france.objects.FranceRegions).features; //translate TopoJSON

       //add Europe countries to map
       var countries = map.append("path") //create SVG path element
           .datum(europeCountries) //datum is a method to bind data to the element
           .attr("class", "countries") //assign class for styling
           .attr("d", path); //project data as geometry in SVG

       //add France regions to map
       var regions = map.selectAll(".regions") //select regions
           .data(franceRegions) //bind data
           .enter() //create placeholder for new data
           .append("path") //create SVG path element
           .attr("class", function(d){
               return "regions " + d.properties.adm1_code; //assign class for styling
           }) //assign class for styling
           .attr("d", path); //project data as geometry in SVG
};