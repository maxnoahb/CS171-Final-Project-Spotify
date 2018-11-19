/*
 * ChoroplethMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- audio data
 * @param _data             -- map data
 * @param _data             -- map names data
 */

ChoroplethVis = function(_parentElement, _audio_data, _map_data, _map_names){
    this.parentElement = _parentElement;
    this.music = _audio_data;
    this.map = _map_data;
    this.map_names = _map_names;
    this.initVis();
}

ChoroplethVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

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
    var colorscale = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

    // Convert the TopoJSON to GeoJSON
    var world = topojson.feature(world_data, world_data.objects.countries).features;
    console.log(world);

    // Get Danceability attributes and merge attribute into world data
    var dancability = [];
    var music_data = this.music;
    var map_names = this.map_names;


    // Merge data
    // Source: Interactive Data Visualization for the Web - Scott Murray
    for (var i = 0; i < music_data.length; i++){

        // Grab country name
        var country = music_data[i].country;
        var country_id;

        // Grab dancebility
        var dance = music_data[i].danceability;
        dancability.push(dance);

        // Find corresponding country inside of country names and get ID
        for (var k = 0; k < map_names.length; k++){
            if (country == map_names[k].name){
                country_id = map_names[k].id;
                break;
            }
        }

        // Find the corresponding country id inside the GeoJSON
        for (var j = 0; j < world.length; j++) {
            var json_country_id = world[j].properties.id;
            if (country_id == json_country_id) {
                // Copy the data value into the JSON
                world[j].properties.danceability = dance;
                //Stop looking through the JSON
                break;
            }
        }
    }

    // Domain
    console.log(danceability);
    colorscale.domain([d3.min(dancability),d3.max(dancability)]);

    // Render the world atlas by using the path generator for WATER
    svg.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
            //Get data value
            var dance = d.properties.danceability;
            if (dance) {
                //If value exists...
                return colorscale(dance);
            }
            else{
                //If value is undefined...
                return "gray";
            }});

    vis.wrangleData();

};

ChoroplethVis.prototype.wrangleData = function(){
    var vis = this;

    vis.updateChoropleth();

};

ChoroplethVis.prototype.updateChoropleth = function(){
    var vis = this;
};