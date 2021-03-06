/*
 * ChoroplethMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- audio data
 * @param _data             -- map data
 * @param _data             -- map names data
 */


ChoroplethVis = function(_parentElement, _music, _mapjson, _mapnames){
    this.parentElement = _parentElement;
    this.music = _music;
    this.map = _mapjson;
    this.map_names = _mapnames;
    this.initVis();
}

var dance_list = [];
var valence_list = [];
var speech_list = [];
var loud_list = [];
var acoustic_list = [];

var world;
var colorscale;
var path;
var legend;
var box_w;
var box_h;
var distance;
var legend_labels;

ChoroplethVis.prototype.initVis = function(){
    var vis = this;
    var map_names = this.map_names;
    var music_data = this.music;

    // SVG drawing area
    vis.margin = { top: 20, right: 70, bottom: 200, left: 10 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 400 - vis.margin.top - vis.margin.bottom;
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Background
    vis.svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .style("fill","none")
        .style("pointer-events", "all")
        .call(d3.zoom() // Call Zoom
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed));

    // Create a mercator projection and draw path
    projection = d3.geoMercator().translate([width / 2 + 200, height / 2])
        .scale(110);
    path = d3.geoPath().projection(projection);

    // Set color scale
    colorscale = d3.scaleQuantize()
        .range(["#B7BCD1", "#969AB9", "#7779A0", "#595885", "#3f3b69"]);

    // Convert the TopoJSON to GeoJSON
    world = topojson.feature(this.map, this.map.objects.countries).features;

    // Merge Spotify data and country names
    for (var i = 0; i < music_data.length; i++){

        // Grab country name from Spotify data
        var country = music_data[i].key.replace(" Top 50","");

        // Find country ID in the world map names
        for (var m = 0; m < map_names.length; m++){
            if (map_names[m].name === country){
               var country_id = parseInt(map_names[m].id)
            }
        }

        // Grab attributes from Spotify Data and scale
        var dance = music_data[i].value.danceability;
        var valence = music_data[i].value.valence;
        var speechiness = music_data[i].value.speechiness;
        var loudness = music_data[i].value.loudness;
        var acousticness = music_data[i].value.acousticness;

        dance_list.push(dance);
        valence_list.push(valence);
        speech_list.push(speechiness);
        loud_list.push(loudness);
        acoustic_list.push(acousticness);

        // Find the corresponding country id inside the GeoJSON
        for (var j = 0; j < world.length; j++) {
            var json_country_id = world[j].id;
            if (country_id === json_country_id) {
                // Copy the attributes into the JSON
                world[j].danceability = dance;
                world[j].valence = valence;
                world[j].speechiness = speechiness;
                world[j].loudness = loudness;
                world[j].acousticness = acousticness;

                // Copy country name into the JSON
                world[j].country = country;

                //Stop looking through the JSON
                break;
            }
        }
    }

    // console.log(world);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d){
            if (d.danceability) {
                return d.country;
            }
            else {
                return "Does not have Spotify";
            }
        })
        .direction('s');

    vis.svg.call(tip);

    // Domain
    colorscale.domain([d3.min(dance_list),d3.max(dance_list)]);

    // Render the world atlas by using the path generator for danceability
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
            }})
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) {
            return vis.showCountry(d.country);
        });

    // Zoomable feature
    function zoomed() {
        vis.svg.selectAll("path").attr("transform", d3.event.transform);
    }

    var max = d3.max(dance_list);
    var min = d3.min(dance_list);
    var median = (max + min)/2;
    var median1 = (min + median)/2;
    var median2 = (median + max)/2;
    var sample_data = [min, median1, median, median2, max];

    // Create legend
    legend = vis.svg.selectAll("g.legend")
        .data(sample_data)
        .enter().append("g")
        .attr("class","legend");

    box_w = 25;
    box_h = 25;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return 160 + vis.height-(i*box_h)-2*box_h;})
        .attr("width", box_w)
        .attr("height", box_h)
        .style("fill", function(d) { return colorscale(d);});

    // Legend labels
    distance = (d3.max(dance_list) - d3.min(dance_list))/5;
    legend_labels = [d3.min(dance_list).toFixed(2) + " - " + (d3.min(dance_list) + distance).toFixed(2),
        (d3.min(dance_list) + distance).toFixed(2) + " - " + (d3.min(dance_list) + 2*distance).toFixed(2),
        (d3.min(dance_list) + 2*distance).toFixed(2) + " - " + (d3.min(dance_list) + 3*distance).toFixed(2),
        (d3.min(dance_list) + 3*distance).toFixed(2) + " - " + (d3.min(dance_list) + 4*distance).toFixed(2),
        (d3.min(dance_list) + 4*distance).toFixed(2) + " - " + (d3.min(dance_list) + 5*distance).toFixed(2)];

    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return 160 + vis.height - (i*box_h) - box_h - 4;})
        .attr("fill", "#2B3A42")
        .text(function(d,i){return legend_labels[i];});

    vis.updateChoropleth();

};

ChoroplethVis.prototype.updateChoropleth = function(){
    var vis = this;

    // Get selected attribute
    vis.attribute = d3.select("#attribute").property("value"); // Return string, e.g. "danceability"

    var text_box = d3.select("#attribute-text");

    // Find list
    var list;
    if (vis.attribute==="danceability"){
        list = dance_list;
        text_box.text("Danceability describes how suitable a track is for dancing based on a combination of musical " +
            "elements including tempo, rhythm stability, beat strength, and overall regularity.");
    }
    if (vis.attribute==="valence"){
        list = valence_list;
        text_box.text("Valence describes the musical positiveness conveyed by a track. Tracks with high valence sound " +
            "more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).");
    }
    if (vis.attribute==="speechiness"){
        list = speech_list;
        text_box.text("Speechiness detects the presence of spoken words in a track. The more exclusively speech-like " +
            "the recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value.");
    }
    if (vis.attribute==="loudness"){
        list = loud_list;
        text_box.text("Loudness is the quality of a sound that is the primary psychological correlate of physical " +
            "strength (amplitude).");
    }
    if (vis.attribute==="acousticness"){
        list = acoustic_list;
        text_box.text("Acousticness is a confidence measure from 0 to 100 of whether the track is acoustic. 100 " +
            "represents high confidence the track is acoustic.");
    }

    // Update domain
    colorscale.domain([d3.min(list),d3.max(list)]);

    // Change the fill based on attribute
    vis.svg.selectAll("path")
        .transition()
        .duration(500)
        .style("stroke", "#FAFAFA")
        .attr('fill-opacity', function (d) {
          //Get data value
          var attribute = d[vis.attribute];
          if (attribute) {
              //If value exists...
              return 1;
          }
          else{
              // If value is undefined...
              return 0.3;
          }
        })
        .style("fill", function(d) {
            //Get data value
            var attribute = d[vis.attribute];
            if (attribute) {
                //If value exists...
                return colorscale(attribute);
            }
            else{
                // If value is undefined...
                return "#d3d3d3";
            }});

    // Update labels
    // Legend labels
    distance = (d3.max(list) - d3.min(list))/5;
    legend_labels = [d3.min(list).toFixed(2) + " to " + (d3.min(list) + distance).toFixed(2),
        (d3.min(list) + distance).toFixed(2) + " to " + (d3.min(list) + 2*distance).toFixed(2),
        (d3.min(list) + 2*distance).toFixed(2) + " to " + (d3.min(list) + 3*distance).toFixed(2),
        (d3.min(list) + 3*distance).toFixed(2) + " to " + (d3.min(list) + 4*distance).toFixed(2),
        (d3.min(list) + 4*distance).toFixed(2) + " to " + (d3.min(list) + 5*distance).toFixed(2)];

    legend.select("text")
        .transition()
        .duration(800)
        .attr("x", 50)
        .attr("y", function(d, i){ return 160 + vis.height - (i*box_h) - box_h - 4;})
        .text(function(d,i){return legend_labels[i];});

};
