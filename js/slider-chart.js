
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data
 */

SliderVis = function(_parentElement, _data, _mapjson, _mapnames) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.map = _mapjson;
    this.map_names = _mapnames;

    this.initVis();
}

SliderVis.prototype.initVis = function() {
    var vis = this;

    // Check that data is properly imported
    // console.log(this.data);

    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // initialize country to draw to nothing
    vis.countryToDraw = [];

    // create a first guess for the projection
    vis.center = d3.geoCentroid(vis.countryToDraw);
    vis.scale = 100;
    vis.offset = [vis.width/2, vis.height/2];
    vis.projection = d3.geoMercator()
        .translate(vis.offset)
        .scale(vis.scale)
        .center(vis.center);

    // draw initial path
    vis.path = d3.geoPath().projection(vis.projection);

    console.log(vis.offset);

    // console.log(vis.bounds);

    vis.wrangleData();

}

/*
 * Data wrangling
 */

SliderVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.data;

    // Convert the TopoJSON to GeoJSON
    vis.world = topojson.feature(vis.map, vis.map.objects.countries).features;
    vis.mapNames = vis.map_names;

    // console.log(countryAvgAttributes);
    // console.log(mapData);
    // console.log(mapNameData);

    // Update the visualization
    vis.updateVis();
}

SliderVis.prototype.updateVis = function() {
    var vis = this;

    // run function to update result when button is clicked
    d3.select("#match-button").on("click", function() {

        vis.onButtonClick();

        $('#selectedCountryName').html(vis.similarCountry.replace(" Top 50",""));

        vis.country = vis.similarCountry.replace(" Top 50","");

        for (var m = 0; m < vis.mapNames.length; m++) {
            if (vis.mapNames[m].name === vis.country){
                vis.countryId = parseInt(vis.mapNames[m].id);
            }
        }

        vis.countryToDraw = vis.world.filter(function(d) {
            return d.id === vis.countryId;
        });

        vis.projection = d3.geoMercator()
            .fitSize([vis.width, vis.height], vis.countryToDraw[0]);
            // .reflectY(true);

        vis.path = vis.path.projection(vis.projection);

        vis.countryOutline = vis.svg
            .selectAll(".country")
            .data(vis.countryToDraw);

        vis.countryOutline
            .enter()
            .append("path")
            .attr("class", "country");

        vis.countryOutline
            .attr("d", vis.path)
            .style("fill", "#4CAF50");

        vis.countryOutline.exit().remove();

    });



    // vis.selectedCountryName = vis.svg.append("g")
    //     .attr("transform", "translate(" + 10 + ", " + 10 + ")");

}

SliderVis.prototype.onButtonClick = function() {
    var vis = this;

    // get the slider selected values
    vis.acousticnessSelection = d3.select("#acousticness-slider").property("value");
    vis.danceabilitySelection = d3.select("#danceability-slider").property("value");
    vis.speechinessSelection = d3.select("#speechiness-slider").property("value");
    vis.valenceSelection = d3.select("#valence-slider").property("value");

    // initialize variables to update in loop to find the matched country
    vis.lowestDifference = 10;
    vis.similarCountry = null;

    // loop through all countries
    countryAvgAttributes.forEach(function(d) {

        // find the sum of the differences between the slider selected value and the respective
        // attribute for that country
        var difference = Math.abs(vis.acousticnessSelection*.01 - d.value.acousticness) +
            Math.abs(vis.danceabilitySelection*.01 - d.value.danceability) +
            Math.abs(vis.speechinessSelection*.01 - d.value.speechiness) +
            Math.abs(vis.valenceSelection*.01 - d.value.valence);

        // if the sum of the four differences for that country is the lowest so far,
        // update the similarCountry to be that country
        if (difference < vis.lowestDifference) {
            vis.lowestDifference = difference;
            vis.similarCountry = d.key;
        }
    });

    return vis.similarCountry;

}