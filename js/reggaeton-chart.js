ReggaetonChart = function(_parentElement, _data){
    this.parentElement = _parentElement;

    this.initVis();
}

// chart to visualize the rising popularity of reggaeton music
// based on data from: https://insights.spotify.com/us/2017/09/05/how-reggaeton-became-a-global-phenomenon-on-spotify/

ReggaetonChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 20, right: 50, bottom: 0, left: 300};
    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.height = 160 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    var reggaetonData = [119, 13, 4];

    // scales
    vis.xScale = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0, 119]);

    vis.yScale = d3.scaleBand()
        .range([0, vis.height])
        .domain(reggaetonData)
        .padding(.2);

    // draw bars
    vis.reggaetonBars = vis.svg.selectAll(".reggaeton-bars")
        .data(reggaetonData);

    vis.reggaetonBars.enter().append("rect")
        .attr("class", "reggaeton-bars")
        .attr("x", 0)
        .attr("y", function(d){return vis.yScale(d)})
        .attr("width", function(d){return vis.xScale(d)})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "#4FB99F");

    // draw left labels
    vis.leftLabels = vis.svg.selectAll(".reggaeton-left-labels")
        .data(reggaetonData);

    vis.leftLabels.enter().append("text")
        .attr("class", "reggaeton-left-labels")
        .text(function(d){
            if (d === 119) { return "Reggaeton Music"}
            else if (d === 13) { return "Pop Music"}
            else {return "Country Music"}
        })
        .attr("x", -5)
        .attr("y", function(d){return vis.yScale(d) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .attr("text-anchor", "end");

    // draw title
    vis.svg.append("text")
        .text("% Music Share Growth on Spotify from 2014 to 2017")
        .attr("x", 0)
        .attr("y", 2)
        .attr("text-align", "center")
        .style("font-weight", "bold");

    // draw number labels
    vis.numberLabels = vis.svg.selectAll(".reggaeton-number-labels")
        .data(reggaetonData);

    vis.numberLabels.enter().append("text")
        .attr("class", "reggaeton-number-labels")
        .text(function(d){return d.toString() + "%"})
        .attr("x", function(d){return vis.xScale(d) + 5})
        .attr("y", function(d){return vis.yScale(d) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .attr("text-anchor", "start");

};

