AttributeSoundbites = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

AttributeSoundbites.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 10, right: 200, bottom: 20, left: 20};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 300 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // scales and axes
    vis.xScale = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0,1]);

    vis.yScale = d3.scaleBand()
        .range([0, vis.height/2])
        .padding(.3);

    vis.yScale.domain(["danceability", "valence", "speechiness", "loudness", "acousticness"]);


    vis.wrangleData();

}

AttributeSoundbites.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();

}

AttributeSoundbites.prototype.initVis = function() {
    var vis = this;

    vis.updateVis();

}

