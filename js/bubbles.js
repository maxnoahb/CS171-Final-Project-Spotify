
// Create drawing area
var margin = {top: 20, right: 10, bottom: 20, left: 10},
    width = 960 - margin.left - margin.right,
    height = 760 - margin.top - margin.bottom;

var svg = d3.select('#bubble-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chargeStrength = 1;

// initialize tooltip
var tip = d3.tip()
    .attr("class", "d3-tip");


// Create bubble chart
function updateBubbles(country) {

  console.log(country);

  // Keep an array of the selected country's top 50 tracks' names
  var trackNames = [];

  var selectedTop50 = dataByCountry[country];
  console.log(selectedTop50);

  // Update array of track names
  selectedTop50.forEach(function (d) {
    trackNames.push(d.track_name);
  });

  console.log(trackNames);

  // Create scale that determines radius of circles
  var radius = d3.scaleLinear()
                 .domain(d3.extent(frequencyData, function(d) { return d.Freq; }))
                 .range([3, 60]);

  // Create force simulation
  var force = d3.forceSimulation(frequencyData)
                .force("charge", d3.forceManyBody().strength(chargeStrength))
                .force("collide", d3.forceCollide(function (d) {
                  return radius(d.Freq) + 3;
                }))
                .force("center", d3.forceCenter().x(width/2).y(height/2));



  // Create bubbles
  var bubble = svg.selectAll(".node")
          .data(frequencyData);

  bubble.enter().append("circle")
          .attr("class", "node")
          .attr("r", function (d) {
            return radius(d.Freq);
          })
          .merge(bubble)
          		.attr("fill", function (d) {
                if (trackNames.includes(d.Var1)) {
                  return "#4CAF50";
                }
                else {
                  return "#d3d3d3";
                }
              })
          // Tooltip
          // Inspired by http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
          .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div.html(d.Var1)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
          .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  bubble.exit().remove();

  // Update nodes on tick
  force.on("tick", function() {
    // Update node coordinates
    bubble.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });



  // Make nodes draggable
  // https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
  function dragSubject() {
    return force.find(d3.event.x, d3.event.y);
  }

  bubble.call(d3.drag()
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

    bubble.classed("dragging", false);

    if (!d3.event.active) {
      force.alphaTarget(0);
    }

    d3.event.subject.fx = null;
    d3.event.subject.fy = null;

  }

  function drawNode(d) {
    bubble.moveTo(d.x + 3, d.y);
    bubble.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

}
