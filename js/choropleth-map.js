/*
 * ChoroplethMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- audio data
 * @param _data             -- map data
 * @param _data             -- map names data
 */

ChoroplethVis = function(_parentElement, _audio_data, _map_data, _map_names){
    this.parentElement = _parentElement;
    this.audio = _audio_data;
    this.map = _map_data;
    this.map_names = _map_names;
    this.initVis();
}

ChoroplethVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Create a mercator projection and draw path
    // Source: http://bl.ocks.org/areologist/dcb4b546e24dfda5b4cfba57b23d91d3
    var projection = d3.geoMercator().translate([width / 2, height / 2]);
    var path = d3.geoPath().projection(projection);

    // Set color scale
    var colorscale = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)",
            "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

    // Initilize Danceability Choropleth
    var map = this.map;
    var music = this.audio;

    // Get the country names from music data
    music.forEach(function(d){
        d.country = d.playlist_name.replace(" Top 50","");
    });
    console.log(music);

    vis.wrangleData();

};

ChoroplethVis.prototype.wrangleData = function(){
    var vis = this;

    vis.updateChoropleth();

};

ChoroplethVis.prototype.updateChoropleth = function(){
    var vis = this;
};