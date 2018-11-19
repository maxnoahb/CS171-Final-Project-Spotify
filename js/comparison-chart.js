ComparisonChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.leftChartData = _data;
    this.rightChartData = _data;

    this.initVis();
}

var countries = ['Japan', 'Israel', 'Hong Kong', 'Indonesia', 'Malaysia', 'Philippines',
    'Singapore', 'Taiwan', 'Thailand', 'Vietnam', 'Austria', 'Belgium',
    'Bulgaria', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia',
    'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Slovakia', 'Spain', 'Sweden', 'Switzerland', 'Turkey',
    'United Kingdom', 'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Costa Rica',
    'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'Mexico',
    'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Uruguay', 'Canada', 'United States',
    'South Africa', 'Australia', 'New Zealand'];
countries.sort();

/*
 * Initialize visualization
 */

ComparisonChart.prototype.initVis = function(){
    var vis = this;

    // based off of http://jsfiddle.net/Curt/preYN/
    $(function(){
        var $select = $("#countries-list");
        countries.forEach(function (d) {
            $select.append($('<option></option>').val(d).html(d))
        });
    });

    vis.margin = {top: 50, right: 120, bottom: 20, left: 120};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 300 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // scales and axes
    vis.xScaleLeft = d3.scaleLinear()
        .range([0, vis.width/2])
        .domain([1,0]);

    vis.xScaleRight = d3.scaleLinear()
        .range([0, vis.width/2])
        .domain([0,1]);

    // console.log(vis.data.map(function(d){return d.value}));

    vis.yScale = d3.scaleBand()
        .range([0, vis.height])
        .padding(.2);

    // set USA and Argentina as default countries
    vis.leftChartData = vis.data.filter(function(d){
        return d.playlist_name === "United States Top 50";
    });

    vis.rightChartData = vis.data.filter(function(d){
        return d.playlist_name === "Argentina Top 50";
    });

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

ComparisonChart.prototype.wrangleData = function(){
    var vis = this;

    // reorganize data to give me average values for each country
    vis.leftChartData = d3.nest()
        .key(function(d) { return d.playlist_name; })
        .rollup(function(v) {
            return [
                {"danceability": d3.mean(v, function(d) { return d.danceability; })},
                {"energy": d3.mean(v, function(d) { return d.energy; })},
                {"instrumentalness": d3.mean(v, function(d) { return d.instrumentalness})},
                {"valence": d3.mean(v, function(d) { return d.valence; })}
            ];
        })
        .entries(vis.leftChartData);

    vis.rightChartData = d3.nest()
        .key(function(d) { return d.playlist_name; })
        .rollup(function(v) {
            return [
                {"danceability": d3.mean(v, function(d) { return d.danceability; })},
                {"energy": d3.mean(v, function(d) { return d.energy; })},
                {"instrumentalness": d3.mean(v, function(d) { return d.instrumentalness})},
                {"valence": d3.mean(v, function(d) { return d.valence; })}
            ];
        })
        .entries(vis.rightChartData);

    console.log(vis.leftChartData);
    console.log(vis.rightChartData);

    // Update the visualization
    vis.updateVis();
}


/*
 * The drawing function
 */

ComparisonChart.prototype.updateVis = function(){
    var vis = this;

    vis.yScale.domain(["energy", "danceability", "instrumentalness", "valence"]);

    // draw headers
    vis.svg.append("text")
        .text(vis.leftChartData[0].key)
        .attr("x", vis.width/2 - 50)
        .attr("y", -vis.margin.top/4)
        .attr("class", "comparison-country-labels")
        .style("text-anchor", "end");

    var chosenCountryLabel = vis.svg.selectAll(".comparison-country-label-right")
        .data(vis.rightChartData[0]);

    chosenCountryLabel.enter().append("text")
        .text(function(d){return d.key})
        .attr("x", vis.width/2 + 50)
        .attr("y", -vis.margin.top/4)
        .attr("class", "comparison-country-label-right")
        .style("text-anchor", "start");

    // draw left rectangles
    var leftBars = vis.svg.selectAll(".left-bar-group")
        .data(vis.leftChartData[0].value);

    // used for reference:  https://stackoverflow.com/questions/45847254/d3-bar-chart-reverse-bars-from-right-to-left
    leftBars.enter().append("rect")
        .attr("class", "left-bar-group")
        .attr("x", function(d){return vis.xScaleLeft(d[Object.keys(d)[0]]) - 3})
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.width/2 - vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "lightblue");

    // draw dividing line
    vis.svg.append("line")
        .attr("x1", vis.width/2)
        .attr("y1", 0)
        .attr("x2", vis.width/2)
        .attr("y2", vis.height)
        .style("stroke-width", 1)
        .style("stroke", "black");

    // draw right rectangles
    var rightBars = vis.svg.selectAll(".right-bar-group")
        .data(vis.rightChartData[0].value);

    // used for reference:  https://stackoverflow.com/questions/45847254/d3-bar-chart-reverse-bars-from-right-to-left
    rightBars.enter().append("rect")
        .attr("class", "right-bar-group")
        .attr("x", vis.width/2 + 3)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "lightblue");

    rightBars.exit().remove();
    // chosenCountryLabel.exit().remove();

    console.log("test6");

    rightBars.transition()
        .duration(800)
        .attr("x", vis.width/2 + 3)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "lightblue");

    // chosenCountryLabel.transition()
    //     .duration(800)
    //     .text(function(d){return d.key})
    //     .attr("x", vis.width/2 + 50)
    //     .attr("y", -vis.margin.top/4);
        // .attr("class", ".comparison-country-label-right")
        // .style("text-anchor", "start");

}

ComparisonChart.prototype.onCountryCompareChange = function(){
    var vis = this;

    vis.chosenCountry = d3.select("#countries-list").property("value");

    vis.leftChartData = vis.data.filter(function(d){
        return d.playlist_name === "United States Top 50";
    });

    vis.rightChartData = vis.data.filter(function(d){
        return d.playlist_name === (vis.chosenCountry + " Top 50");
    });

    vis.wrangleData();
}

