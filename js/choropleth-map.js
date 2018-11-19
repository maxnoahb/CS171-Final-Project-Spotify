/*
 * ChoroplethMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- audio data
 * @param _data             -- map data
 * @param _data             -- map names data
 */

// Green #4caf50

ChoroplethVis = function(_parentElement, _music, _mapjson, _mapnames){
    this.parentElement = _parentElement;
    this.music = _music;
    this.map = _mapjson;
    this.map_names = _mapnames;
    this.initVis();
}

var dance_list = [];
var energy_list = [];
var loud_list = [];
var valence_list = [];

var world;
var colorscale;
var path;

ChoroplethVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 560 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Create a mercator projection and draw path
    var projection = d3.geoMercator().translate([width / 2, height / 2]);
    var path = d3.geoPath().projection(projection);

    // Set color scale
    colorscale = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

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
        var energy = music_data[i].value.energy;
        var loudness = music_data[i].value.loudness;
        var valence = music_data[i].value.valence;
        energy_list.push(energy);
        loud_list.push(loudness);
        valence_list.push(valence);
        dance_list.push(dance);

        // Find the corresponding country id inside the GeoJSON
        for (var j = 0; j < world.length; j++) {
            var json_country_id = world[j].id;
            if (country_id === json_country_id) {
                // Copy the data value into the JSON
                world[j].danceability = dance;
                world[j].energy = energy;
                world[j].loudness = loudness;
                world[j].valence = valence;
                //Stop looking through the JSON
                break;
            }
        }
    }

    console.log(world);

    // Domain
    colorscale.domain([d3.min(dance_list),d3.max(dance_list)]);

    // Render the world atlas by using the path generator for WATER
    vis.svg.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
            //Get data value
            var dance = d.danceability;
            if (dance) {
                //If value exists...
                return colorscale(dance);
            }
            else{
                // If value is undefined...
                return "#d3d3d3";
            }});

    vis.wrangleData();

};

ChoroplethVis.prototype.wrangleData = function(){
    var vis = this;

    vis.updateChoropleth();

};

ChoroplethVis.prototype.updateChoropleth = function(){
    var vis = this;

    vis.attribute = d3.select("#attribute").property("value"); // Return string "danceability"
    console.log(vis.attribute);

    // Find list
    var list;
    if (vis.attribute==="danceability"){
        list = dance_list;
    }
    if (vis.attribute==="energy"){
        list = energy_list;
    }
    if (vis.attribute==="loudness"){
        list = loud_list;
    }
    if (vis.attribute==="valence"){
        list = valence_list;
    }

    colorscale.domain([d3.min(list),d3.max(list)]);

    // Render the world atlas by using the path generator for WATER
    vis.svg.selectAll("path")
        .style("fill", function(d) {
            //Get data value
            var attribute = d[vis.attribute];
            if (attribute) {
                //If value exists...
                console.log("match");
                return colorscale(attribute);
            }
            else{
                // If value is undefined...
                return "#d3d3d3";
            }});


};