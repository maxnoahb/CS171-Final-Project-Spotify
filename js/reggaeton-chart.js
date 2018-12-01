ReggaetonChart = function(_parentElement, _data){
    this.parentElement = _parentElement;

    this.initVis();
}

// chart to visualize the rising popularity of reggaeton music
// based on data from: https://insights.spotify.com/us/2017/09/05/how-reggaeton-became-a-global-phenomenon-on-spotify/

ReggaetonChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 10, right: 0, bottom: 20, left: 0};
    vis.width = 400 - vis.margin.left - vis.margin.right;
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    var reggaetonData = {
      "reggaeton": 119,
      "pop": 13,
      "country":4
    };

    // scales
    vis.xScale = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0, 119]);

    vis.yScale = d3.scaleBand()
        .range([0, vis.height])
        .domain([119, 13, 4])
        .padding(.2);

    // draw bars
    var reggaetonBars = vis.svg.selectAll(".reggaeton-bars")
        .data(reggaetonData);

    reggaetonBars.enter().append("rect")
        .attr("class", "reggaeton-bars")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "black");

};

