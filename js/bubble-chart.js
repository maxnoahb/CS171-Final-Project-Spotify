/*
 * BubbleChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _userCountry -- user's selected country
 * @param _data				-- audio data
 */


BubbleChart = function (_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;

  this.initVis();
}

// Initialize visualization
BubbleChart.prototype.initVis = function () {

  var vis = this;

  // Country filter initially set to false
  vis.filter = false;

  // Set margins and define svg area
  vis.margin = {top: 20, right: 10, bottom: 20, left: 10},
      vis.width = 960 - margin.left - margin.right,
      vis.height = 760 - margin.top - margin.bottom;

  vis.svg = d3.select("#" + vis.parentElement).append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');

  // Scale that determines radius of bubbles
  vis.radius = d3.scaleLinear()
                 .domain(d3.extent(vis.data, function(d) { return d.Freq; }))
                 .range([3, 60]);

  // Define the div for the tooltip
  vis.div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  vis.chargeStrength = 0.5;

  // Create force simulation
  vis.force = d3.forceSimulation(vis.data)
                .force("charge", d3.forceManyBody().strength(vis.chargeStrength))
                .force("collide", d3.forceCollide(function (d) {
                  return radius(d.Freq) + 3;
                }))
                .force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2));

  vis.bubble = vis.svg.selectAll(".node")
          .data(vis.data);

  vis.wrangleData("United States");

};

// Wrangle Data
BubbleChart.prototype.wrangleData = function (country) {

  var vis = this;

  vis.selectedTop50 = {};

  // Store the top 50 songs for the selected country in an object
  dataByCountry[country].forEach(function (d) {
    vis.selectedTop50[d.track_name] = d;
  });

  vis.updateVis();

};

// Update visualization
BubbleChart.prototype.updateVis = function () {

  var vis = this;

  vis.bubble.enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
          return vis.radius(d.Freq);
        })
        .merge(vis.bubble)
            .attr("fill", function (d) {
              if (vis.selectedTop50[d.Var1] != null) {
                return "#4caf50";
              }
              else {
                return "#d3d3d3";
              }
            })
        // Tooltip
        // Inspired by http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        .on("mouseover", function(d) {
                  if (!vis.filter || vis.selectedTop50[d.Var1] != null)
                  vis.div.transition()
                      .duration(100)
                      .style("opacity", 1);
                  vis.div.html("<strong>" + d.Var1 + "</strong>" +
                           "<br>" + uniqueSongData[d.Var1].artist_name +
                           "<br>Appears in <strong>" + d.Freq + "</strong> Top 50s"
                          )
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
                  })
        .on("mouseout", function(d) {
            vis.div.style("opacity", 0);
        });

    vis.bubble.exit().remove();

    // Update nodes on tick
    vis.force.on("tick", function() {
      // Update node coordinates
      vis.bubble.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });

    // Make nodes draggable
    // https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
    function dragSubject() {
      return vis.force.find(d3.event.x, d3.event.y);
    }

    vis.bubble.call(d3.drag()
      .on("start", dragStarted)
          .on("drag", dragging)
          .on("end", dragEnded));

    function dragStarted() {

      if (!d3.event.active) {
        vis.force.alphaTarget(0.3).restart();
      }

      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;

    }

    function dragging(d) {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragEnded() {

      vis.bubble.classed("dragging", false);

      if (!d3.event.active) {
        vis.force.alphaTarget(0);
      }

      d3.event.subject.fx = null;
      d3.event.subject.fy = null;

    }

    function drawNode(d) {
      vis.bubble.moveTo(d.x + 3, d.y);
      vis.bubble.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }

};

BubbleChart.prototype.toggleBubbles = function () {

  var vis = this;

  // Toggle filter
  vis.filter = !vis.filter;

  if (vis.filter) {
    d3.select('#filter-toggle').text("Show All of the World's Most Popular Music");

    vis.bubble.transition()
        .duration(500)
        .style("opacity", function (d) {
          if (vis.selectedTop50[d.Var1] == null) {
            return 0;
          }
          else {
            return 1;
          }
        });
  }
  else {
    d3.select('#filter-toggle').text("Show Just Your Country's Top 50");

    vis.bubble.transition()
        .duration(500)
        .style("opacity", 1);
  }

};
