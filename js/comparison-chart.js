ComparisonChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVis();
}


/*
 * Initialize visualization
 */

ComparisonChart.prototype.initVis = function(){
    var vis = this;




    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function(){
    var vis = this;



    // Update the visualization
    vis.updateVis();
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function(){
    var vis = this;


}

