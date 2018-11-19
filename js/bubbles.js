
// Create drawing area
var margin = {top: 20, right: 10, bottom: 20, left: 10},
    width = 960 - margin.left - margin.right,
    height = 760 - margin.top - margin.bottom;

var svg = d3.select('#bubble-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Initiale bubble chart
function updateBubbles() {

  console.log(selectedCountry);

  // Keep an array of the selected country's top 50 tracks' names
  var trackNames = [];

  var selectedTop50 = dataByCountry[selectedCountry];
  console.log(selectedTop50);

  // Update array of track names
  selectedTop50.forEach(function (d) {
    trackNames.push(d.track_name);
  });

  console.log(trackNames);

  var nodes = frequencyData;
  var chargeStrength = 1;

  // Create scale that determines radius of circles
  var radius = d3.scaleLinear()
                 .domain(d3.extent(nodes, function(d) { return d.Freq; }))
                 .range([3, 60]);

  // Create bubbles
  var node = svg.selectAll(".node")
          .data(nodes);

  // Create force simulation
  var force = d3.forceSimulation(nodes)
                .force("charge", d3.forceManyBody().strength(chargeStrength))
                .force("collide", d3.forceCollide(function (d) {
                  return radius(d.Freq) + 3;
                }))
                .force("center", d3.forceCenter().x(width/2).y(height/2));

  node.enter().append("circle")
          .merge(node)
          		.attr("class", "node")
          		.attr("r", function (d) {
                return radius(d.Freq);
              })
          		.attr("fill", function (d) {
                if (trackNames.includes(d.Var1)) {
                  return "#4CAF50";
                }
                else {
                  return "#d3d3d3";
                }
              })
              // Add tooltip
              // Tooltip inspired by sami rubenfeld
              // https://bl.ocks.org/sarubenfeld/56dc691df199b4055d90e66b9d5fc0d2
              .on("mouseover", function(d) {



        				d3.select("#tooltip").classed("hidden", false);
              })
              .on("mouseout", function () {
                d3.select("#tooltip").classed("hidden", true)
              });

  // Update nodes on tick
  force.on("tick", function() {
    // Update node coordinates
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  // Make nodes draggable
  // https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
  function dragSubject() {
    return force.find(d3.event.x, d3.event.y);
  }

  node.call(d3.drag()
    .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

  function dragStarted() {

    if (!d3.event.active) {
      force.alphaTarget(0.3).restart();
    }

    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;

  }

  function dragging(d) {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragEnded() {

    node.classed("dragging", false);

    if (!d3.event.active) {
      force.alphaTarget(0);
    }

    d3.event.subject.fx = null;
    d3.event.subject.fy = null;

  }

  function drawNode(d) {
    node.moveTo(d.x + 3, d.y);
    node.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

  node.exit().remove();
}
