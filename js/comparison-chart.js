ComparisonChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

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

    vis.margin = {top: 20, right: 120, bottom: 20, left: 120};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // scales and axes
    vis.yScale = d3.scaleLinear()
        .range([0, vis.height]);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(" + vis.margin.left + vis.width/2 + "," + vis.margin.top + ")");

    vis.yAxis = d3.axisLeft()
        .scale(vis.yScale);

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

ComparisonChart.prototype.wrangleData = function(){
    var vis = this;

    // reorganize data to give me average values for each country
    vis.displayData = d3.nest()
        .key(function(d) { return d.playlist_name; })
        .rollup(function(v) {
            return {
                // "acousticness": d3.mean(v, function(d) { return d.acousticness; }),
                "danceability": d3.mean(v, function(d) { return d.danceability; }),
                // "duration_ms": d3.mean(v, function(d) { return d.duration_ms; }),
                "energy": d3.mean(v, function(d) { return d.energy; }),
                "instrumentalness": d3.mean(v, function(d) { return d.instrumentalness}),
                // "liveness": d3.mean(v, function(d) { return d.liveness; }),
                // "loudness": d3.mean(v, function(d) { return d.loudness; }),
                // "speechiness": d3.mean(v, function(d) { return d.speechiness; }),
                // "tempo": d3.mean(v, function(d) { return d.tempo; }),
                "valence": d3.mean(v, function(d) { return d.valence; })
            };
        })
        .entries(vis.displayData);

    console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
}


/*
 * The drawing function
 */

ComparisonChart.prototype.updateVis = function(){
    var vis = this;



}

ComparisonChart.prototype.onCountryCompareChange = function(){
    var vis = this;

    vis.chosenCountry = d3.select("#countries-list").property("value");

    vis.displayData = vis.data.filter(function(d){
        return d.playlist_name === (vis.chosenCountry + " Top 50");
    });

    vis.wrangleData();
}

