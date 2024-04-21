//wrap everything is immediately invoked anonymous function so nothing is in clobal scope
(function (){

	//pseudo-global variables
	var attrArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
	var expressed = attrArray[0]; //initial attribute


	//begin script when window loads
	window.onload = setMap();

	//Example 1.3 line 4...set up choropleth map
	function setMap(){

	    //map frame dimensions
    	var width = window.innerWidth * 0.5,
        height = 460;

	    //create new svg container for the map
	    var map = d3.select("body")
	        .append("svg")
	        .attr("class", "map")
	        .attr("width", width)
	        .attr("height", height);

	    //create centered on Top 15 States USA
		var projection = d3
            .geoAlbers()
		    .center([-5, 37.8 ])       
            .translate([width/2, height/2])
            .scale([1000]);


	    var path = d3.geoPath()
	        .projection(projection);

	    //use Promise.all to parallelize asynchronous data loading
	    var promises = [d3.csv("data/States_Top15.csv"),
                        d3.json("data/States_Top15.topojson")
	                   ];
	    Promise.all(promises).then(callback);

	    function callback(data){
			var csvData = data[0], state = data[1];

	        setGraticule(map,path);

	        //translate Top15_States for Tornados, 20 years, 1991-2010 TopoJSON
	        var state_T = topojson.feature(state, state.objects.States_Top15).features;
	            

	        //add Central US States to map
	        //add Central US States to map
	        var states = map.append("path")
	            .datum(state)
	            .attr("class", "states")
	            .attr("d", path);

            //CHECK HERE ************************ console.log(state_T);
            state_T = joinData(state_T, csvData);

	        var colorScale = makeColorScale(csvData);

            setEnumerationUnits(state_T,map,path,colorScale);


	        //add coordinated visualization to the map
        	setChart(csvData, colorScale);

	    };

	    
	};

	function setGraticule(map,path){
		var graticule = d3.geoGraticule()
	            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

	        //create graticule background
	        var gratBackground = map.append("path")
	            .datum(graticule.outline()) //bind graticule background
	            .attr("class", "gratBackground") //assign class for styling
	            .attr("d", path) //project graticule

	        //create graticule lines
	        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
	            .data(graticule.lines()) //bind graticule lines to each element to be created
	            .enter() //create an element for each datum
	            .append("path") //append each element to the svg as a path element
	            .attr("class", "gratLines") //assign class for styling
	            .attr("d", path); //project graticule lines
	}

	function joinData(States_Top15,csvData){
		//loop through csv to assign each set of csv attribute values to geojson region
	        for (var i=0; i<csvData.length; i++){
	            var csvState = csvData[i]; //the current State
	            var csvKey = csvState.STATEFP; //the CSV primary key

	            //loop through geojson regions to find correct state
	            for (var a=0; a<States_Top15.length; a++){

	                var geojsonProps = States_Top15[a].properties; //the current state geojson properties
	                var geojsonKey = geojsonProps.STATEFP; //the geojson primary key

	                //where primary keys match, transfer csv data to geojson properties object
	                if (geojsonKey == csvKey){

	                    //assign all attributes and values
	                    attrArray.forEach(function(attr){
	                        var val = parseFloat(csvState[attr]); //get csv attribute value ?? flOAT WHY NOT INT
	                        geojsonProps[attr] = val; //assign attribute and value to geojson properties
	                    });
	                };
	            };
	        };
	        return States_Top15;
	}
//fix color scale to teal************************
	function makeColorScale(data){
		var colorClasses = [
	        "#f1eef6",
	        "#bdc9e1",
	        "#74a9cf",
	        "#2b8cbe",
	        "#045a8d"
	    ];

	    //create color scale generator  ********************************* Classification of data - Quantile, Equal Interval, or Natural Breaks 
	    var colorScale = d3.scaleQuantile()
	        .range(colorClasses);

	    //build array of all values of the expressed attribute ************************Why FLOAT NOt INT
	    var domainArray = [];
	    for (var i=0; i<data.length; i++){
	        var val = parseFloat(data[i][expressed]);
	        domainArray.push(val);
	    };

	    //assign array of expressed values as scale domain
	    colorScale.domain(domainArray);

	    return colorScale;
	}

    function setEnumerationUnits(States_Top15,map,path,colorScale){
        //add States to map
        var st = map.selectAll(".st")
            .data(States_Top15)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "name: " + d.properties.NAME;
            })
            .attr("d", path)
            .style("stroke", "#000")
            .style("fill", function(d){
                var value = d.properties[expressed];
                if(value) {
                    return colorScale(d.properties[expressed]);
                } else {
                    return "#ccc";
                }
        });
}

//function to create coordinated bar chart
function setChart(csvData, colorScale){
    //chart frame dimensions
    var chartWidth = window.innerWidth * 0.425,
    chartHeight = 460;

    //create a second svg element to hold the bar chart
    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");

     //create a scale to size bars proportionally to frame
    var yScale = d3.scaleLinear()
        .range([0, chartHeight])
        .domain([0, 180]);

    //Example 2.4 line 8...set bars for each State ************************ Ch FIPS field********
    var bars = chart.selectAll(".bars")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return a[expressed]-b[expressed]
        })
        .attr("class", function(d){
            return "bars " + d.STATEFP;
        })
        .attr("width", chartWidth / csvData.length - 1)
        .attr("x", function(d, i){
            return i * (chartWidth / csvData.length);
        })
        .attr("height", function(d){
            return yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d){
            return chartHeight - yScale(parseFloat(d[expressed]));
        }).style("fill", function(d){
            return colorScale(d[expressed]);
        });

    //annotate bars with attribute value text
    var numbers = chart.selectAll(".numbers")
        .data(csvData)
        .enter()
        .append("text")
        .sort(function(a, b){
            return a[expressed]-b[expressed]
        })
        .attr("class", function(d){
            return "numbers " + d.STATEFP;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i){
            var fraction = chartWidth / csvData.length;
            return i * fraction + (fraction - 1) / 2;
        })
        .attr("y", function(d){
            return chartHeight - yScale(parseFloat(d[expressed])) + 15;
        })
        .text(function(d){
            return d[expressed];
        });

    var chartTitle = chart.append("text")
        .attr("x", 20)
        .attr("y", 40)
        .attr("class", "chartTitle")
        .text("20 yr Average Tornadoes of variable " + expressed[3] + " in each State"); // Check here ************************
};

})();