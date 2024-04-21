//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //use Promise.all to parallelize asynchronous data loading
    var promises = [d3.csv("data/unitsData.csv"),                    
                    d3.json("data/EuropeCountries.topojson"),                    
                    d3.json("data/FranceRegions.topojson")                   
                    ];    
    Promise.all(promises).then(callback);
};