//begin script when window loads
window.onload = setMap();

//Example 1.3 line 4...set up choropleth map
function setMap() {
    //use Promise.all to parallelize asynchronous data loading

    var promises = [
        d3.csv("data/OK_Sm.csv"),
        d3.json("data/OKr.topojson"),
        d3.json("data/OKc.topojson"),
    ];
    Promise.all(promises).then(callback);
}

function callback(data) {
    var csvData = data[0],
        state = data[1],
        county = data[2];
        console.log(csvData);
        console.log(state);
        console.log(county);

    //translate state, county TopoJSON
    var stateT = topojson.feature(state, state.objects.OKr),
        countyT = topojson.feature(county, county.objects.OKc);

    //examine the results
    console.log(stateT);
    console.log(countyT);
}

