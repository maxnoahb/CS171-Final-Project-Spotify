
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data
 */

SliderVis = function(_parentElement, _data ) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

SliderVis.prototype.initVis = function() {
    var vis = this;

    // Check that data is properly imported
    // console.log(this.data);

    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.wrangleData();

}

/*
 * Data wrangling
 */

SliderVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.data;

    // console.log(countryAvgAttributes);
    console.log(mapData);
    console.log(mapNameData);

    // Update the visualization
    vis.updateVis();
}

SliderVis.prototype.updateVis = function() {
    var vis = this;

    // run function to update result when button is clicked
    d3.select("#match-button").on("click", function() {vis.onButtonClick()});

    vis.selectedCountryName = vis.svg.append("g")
        .attr("transform", "translate(" + 10 + ", " + 10 + ")");

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

    $('#selectedCountryName').html(vis.similarCountry);

    // console.log(vis.similarCountry);


}