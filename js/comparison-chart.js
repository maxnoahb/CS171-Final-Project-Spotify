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

    vis.margin = {top: 10, right: 120, bottom: 20, left: 120};
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
                {"speechiness": d3.mean(v, function(d) { return d.speechiness})},
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
                {"speechiness": d3.mean(v, function(d) { return d.speechiness})},
                {"valence": d3.mean(v, function(d) { return d.valence; })}
            ];
        })
        .entries(vis.rightChartData);

    // console.log(vis.leftChartData);
    // console.log(vis.rightChartData);

    // Update the visualization
    vis.updateVis();
}


/*
 * The drawing function
 */

ComparisonChart.prototype.updateVis = function(){
    var vis = this;

    vis.yScale.domain(["energy", "danceability", "speechiness", "valence"]);

    console.log(vis.leftChartData);

    // draw left rectangles
    var leftBars = vis.svg.selectAll(".left-bar-group")
        .data(vis.leftChartData[0].value);

    // used for reference:  https://stackoverflow.com/questions/45847254/d3-bar-chart-reverse-bars-from-right-to-left
    leftBars.enter().append("rect")
        .attr("class", "left-bar-group")
        .attr("x", function(d){return vis.xScaleLeft(d[Object.keys(d)[0]]) - 50})
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.width/2 - vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "#4caf50");

    // add music staffs
    // this helped: https://stackoverflow.com/questions/14567809/how-to-add-an-image-to-an-svg-container-using-d3-js
    var musicLeft = vis.svg.selectAll(".left-image")
        .data(vis.rightChartData[0].value);

    musicLeft.enter().append("svg:image")
        .attr("class", "left-image")
        .attr("x", function(d){return vis.xScaleLeft(d[Object.keys(d)[0]]) - 50})
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("height", vis.yScale.bandwidth())
        .attr("width", function(d){return vis.width/2 - vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("xlink:href", "img/music-staff.png");

    // draw right rectangles
    var rightBars = vis.svg.selectAll(".right-bar-group")
        .data(vis.rightChartData[0].value);

    // used for reference:  https://stackoverflow.com/questions/45847254/d3-bar-chart-reverse-bars-from-right-to-left
    rightBars.enter().append("rect")
        .attr("class", "right-bar-group")
        .attr("x", vis.width/2 + 50)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "#4caf50");

    // add music staffs
    var musicRight = vis.svg.selectAll(".right-image")
        .data(vis.rightChartData[0].value);

    musicRight.enter().append("svg:image")
        .attr("class", "right-image")
        .attr("x", vis.width/2 + 50)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("height", vis.yScale.bandwidth())
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("xlink:href", "img/music-staff-2.png");

    // column labels
    var columnLabels = vis.svg.selectAll("text.column-label")
        .data(vis.leftChartData[0].value);

    columnLabels.enter().append("text")
        .attr("class", "column-label")
        .text(function(d){return Object.keys(d)[0]})
        .attr("x", vis.width/2)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0]) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .style("text-anchor", "middle");

    // bar labels
    var leftBarLabels = vis.svg.selectAll("text.left-bar-labels")
        .data(vis.leftChartData[0].value);

    leftBarLabels.enter().append("text")
        .attr("class", "left-bar-labels")
        .text(function(d){ return Math.round(d[Object.keys(d)[0]] * 100)})
        .attr("x", function(d){ return -60 + vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("y", function(d){ return vis.yScale(Object.keys(d)[0]) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .style("text-anchor", "end");

    leftBars.exit().remove();
    // leftBarLabels.exit.remove();

    leftBars.transition()
        .duration(800)
        .attr("x", function(d){return vis.xScaleLeft(d[Object.keys(d)[0]]) - 50})
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.width/2 - vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "#4caf50");

    leftBarLabels.transition()
        .duration(800)
        .attr("class", "left-bar-labels")
        .text(function(d){ return Math.round(d[Object.keys(d)[0]] * 100)})
        .attr("x", function(d){ return -60 + vis.xScaleLeft(d[Object.keys(d)[0]])})
        .attr("y", function(d){ return vis.yScale(Object.keys(d)[0]) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .style("text-anchor", "end");

    var rightBarLabels = vis.svg.selectAll("text.right-bar-labels")
        .data(vis.rightChartData[0].value);

    rightBarLabels.enter().append("text")
        .attr("class", "right-bar-labels")
        .text(function(d){ return Math.round(d[Object.keys(d)[0]] * 100)})
        .attr("x", function(d){ return 60 + vis.xScaleRight(d[Object.keys(d)[0]]) + vis.width/2})
        .attr("y", function(d){ return vis.yScale(Object.keys(d)[0]) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .style("text-anchor", "start");

    // remove
    rightBars.exit().remove();
    musicRight.exit().remove();
    musicLeft.exit().remove();
    rightBarLabels.exit().remove();

    rightBars.transition()
        .duration(800)
        .attr("x", vis.width/2 + 50)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("height", vis.yScale.bandwidth())
        .attr("fill", "#4caf50");

    rightBarLabels.transition()
        .duration(800)
        .attr("class", "right-bar-labels")
        .text(function(d){ return Math.round(d[Object.keys(d)[0]] * 100)})
        .attr("x", function(d){ return 60 + vis.xScaleRight(d[Object.keys(d)[0]]) + vis.width/2})
        .attr("y", function(d){ return vis.yScale(Object.keys(d)[0]) + vis.yScale.bandwidth()/2 + vis.yScale.bandwidth()*.1})
        .style("text-anchor", "start");

    musicRight.transition()
        .duration(800)
        .attr("class", "right-image")
        .attr("x", vis.width/2 + 50)
        .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
        .attr("height", vis.yScale.bandwidth())
        .attr("width", function(d){return vis.xScaleRight(d[Object.keys(d)[0]])})
        .attr("xlink:href", "img/music-staff-2.png");

    // musicLeft.transition()
    //     .duration(800)
    //     .attr("class", "left-image")
    //     .attr("x", function(d){return vis.xScaleLeft(d[Object.keys(d)[0]]) - 50})
    //     .attr("y", function(d){return vis.yScale(Object.keys(d)[0])})
    //     .attr("height", vis.yScale.bandwidth())
    //     .attr("width", function(d){return vis.width/2 - vis.xScaleLeft(d[Object.keys(d)[0]])})
    //     .attr("xlink:href", "img/music-staff.png");

}

ComparisonChart.prototype.onCountryCompareChange = function(){
    var vis = this;

    vis.leftChartData = vis.data.filter(function(d){
        // check the country chosen on first map
        var chosenLeftCountry = document.getElementById("intro-chosen-country").innerHTML;
        // if country was chosen, use that one, if not, use USA
        if (chosenLeftCountry === "Please choose a country with Spotify") {
            return d.playlist_name === "United States Top 50";
        }
        else {
            $('#comparison-country-label-left span').html(chosenLeftCountry.replace("Chosen Country: ",""));
            return d.playlist_name === (chosenLeftCountry.replace("Chosen Country: ","") + " Top 50");
        }
    });

    vis.chosenCountry = d3.select("#countries-list").property("value");

    vis.rightChartData = vis.data.filter(function(d){
        return d.playlist_name === (vis.chosenCountry + " Top 50");
    });

    vis.wrangleData();
}

