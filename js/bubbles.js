
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

// Create bubble chart
function updateBubbles(country) {

  // console.log(country);

  // Create scale that determines radius of circles
  var radius = d3.scaleLinear()
                 .domain(d3.extent(frequencyData, function(d) { return d.Freq; }))
                 .range([3, 60]);

  // Keep an array of the selected country's top 50 tracks' names
  var trackNames = [];

  var selectedTop50 = {};

  dataByCountry[country].forEach(function (d) {
    selectedTop50[d.track_name] = d;
  });

  console.log(selectedTop50);

  // Create force simulation
  var force = d3.forceSimulation(frequencyData)
                .force("charge", d3.forceManyBody().strength(chargeStrength))
                .force("collide", d3.forceCollide(function (d) {
                  return radius(d.Freq) + 3;
                }))
                .force("center", d3.forceCenter().x(width/2).y(height/2));


  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

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
                if (selectedTop50[d.Var1] != null) {
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
                    div.html("<strong>" + d.Var1 + "</strong>" +
                             "<br>" + uniqueSongData[d.Var1].artist_name)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
          .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
          });
          // .on("click", function (d) {
          //     console.log("clicked");
          //     div.transition()
          //         .duration(200)
          //         .style("opacity", 1);
          //     div.html("<strong>" + d.Var1 + "</strong>" +
          //              "<br>" + uniqueSongData[d.Var1].artist_name +
          //              "<br>" + uniqueSongData[d.Var1].artist_name +
          //              "<br>" + uniqueSongData[d.Var1].danceability +
          //              "<br>" + uniqueSongData[d.Var1].energy +
          //              "<br>" + uniqueSongData[d.Var1].loudness +
          //              "<br>" + uniqueSongData[d.Var1].valence)
          //         .style("left", "0px")
          //         .style("top", "0px");
          // });



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


// Create scale for bubble chart just once
var marginScale = {top: 20, right: 10, bottom: 20, left: 10},
    widthScale = 280 - marginScale.left - marginScale.right,
    heightScale = 120 - marginScale.top - marginScale.bottom;

var svgScale = d3.select('#bubble-chart-scale').append('svg')
    .attr('width', widthScale + marginScale.left + marginScale.right)
    .attr('height', heightScale + marginScale.top + marginScale.bottom)
  .append('g')
    .attr('transform', 'translate(' + marginScale.left + ',' + marginScale.top + ')');

function bubbleScale() {
  var scaleTicks = [1,20,40,58];

  // Create scale that determines radius of circles
  var radius = d3.scaleLinear()
                 .domain(d3.extent(frequencyData, function(d) { return d.Freq; }))
                 .range([3, 60]);

  svgScale.selectAll(".bubble-scale")
          .data(scaleTicks).enter()
          .append('circle')
              .attr('cx', function (d, i) {
                return i * (radius(d) + 10);
              })
              .attr('cy', heightScale / 2)
              .attr('r', function (d) {
                return radius(d);
              })
              .style('fill', '#d3d3d3');

}
