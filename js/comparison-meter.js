/*
 * ComparisonMeter - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _userCountry -- user's selected country
 * @param _data				-- audio data
 */


ComparisonMeter = function (_parentElement, _userCountry, _data) {
  this.parentElement = _parentElement;
  this.userCountry = _userCountry;
  this.data = _data;

  this.initVis();
}

// Initialize visualization
ComparisonMeter.prototype.initVis = function () {

  var vis = this;

  // Set margins and define svg area
  vis.margin = {top: 20, right: 10, bottom: 20, left: 10},
      vis.width = 960 - margin.left - margin.right,
      vis.height = 500 - margin.top - margin.bottom;

  vis.svg = d3.select("#" + vis.parentElement).append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');

  // Scales

};
