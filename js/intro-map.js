/*
 * ChoroplethMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- audio data
 * @param _data             -- map data
 * @param _data             -- map names data
 */

// Green #4caf50

IntroMap = function(_parentElement, _music, _mapjson, _mapnames){
    this.parentElement = _parentElement;
    this.music = _music;
    this.map = _mapjson;
    this.map_names = _mapnames;
    this.initVis();
}

var world;
var path;

// var tool_tip;

IntroMap.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 200, left: 30 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Create a mercator projection and draw path
    var projection = d3.geoMercator().translate([vis.width / 2, vis.height / 2 + 200]);
    var path = d3.geoPath().projection(projection);

    // Convert the TopoJSON to GeoJSON
    world = topojson.feature(this.map, this.map.objects.countries).features;
    var map_names = this.map_names;

    // Get Danceability attributes and merge attribute into world data
    var music_data = this.music;

    // Merge data
    for (var i = 0; i < music_data.length; i++){

        // Grab country name
        var country = music_data[i].key.replace(" Top 50","");

        // Find country id
        for (var m = 0; m < map_names.length; m++){
            if (map_names[m].name === country){
                var country_id = parseInt(map_names[m].id)
            }
        }

        // Grab attributes
        var dance = music_data[i].value.danceability;

        // Find the corresponding country id inside the GeoJSON
        for (var j = 0; j < world.length; j++) {
            var json_country_id = world[j].id;
            if (country_id === json_country_id) {
                // Copy the data value into the JSON
                world[j].danceability = dance;
                world[j].country = country;
                //Stop looking through the JSON
                break;
            }
        }
    }

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d){
            if (d.danceability) {
                return d.country;
            }
            else {
                return "No Spotify Here"
            }
        })
        .direction('s');

    vis.svg.call(tip);

    // Render the world atlas by using the path generator for WATER
    vis.svg.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "intro-map-path")
        .style("stroke", "#F0F0DF")
        .style("fill", function(d) {
            //Get data value
            var dance = d.danceability;
            if (dance) {
                //If value exists...
                return "#4FB99F";
            }
            else{
                // If value is undefined...
                return "#d3d3d3";
            }})
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) {
            return vis.showCountry(d.country);
        });


    vis.wrangleData();

};

IntroMap.prototype.wrangleData = function(){
    var vis = this;

    vis.showCountry();

};

IntroMap.prototype.showCountry = function(country){
    // var vis = this;

    if (country) {
        $('#intro-chosen-country').html("Chosen Country: " + country);
        // bubbleChart.wrangleData(country);
        updateBubbles(country);
    }
    else {
        $('#intro-chosen-country').html("Please choose a country with Spotify");

        // make the US the default for bubble chart if country not selected here
        // bubbleChart.wrangleData("United States");
        updateBubbles("United States");
    }

};
