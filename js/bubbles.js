
// Create drawing area
var margin = {top: 0, right: 10, bottom: 5, left: 10},
    width = 960 - margin.left - margin.right,
    height = 390 - margin.top - margin.bottom;
    // height used to be 700 when not fit to small computer

var svg = d3.select('#bubble-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chargeStrength = 0.5;

// var filter = false;

var bubble;



// Create bubble chart
function updateBubbles(country) {

  var selectedTop50 = {};

  // console.log(country);

  // Create scale that determines radius of circles
  var radius = d3.scaleLinear()
                 .domain(d3.extent(frequencyData, function(d) { return d.Freq; }))
                 .range([2, 25]);
  // range used to be 3,60 when not fit to small computer

  // Keep an array of the selected country's top 50 tracks' names
  var trackNames = [];

  dataByCountry[country].forEach(function (d) {
    selectedTop50[d.track_name] = d;
  });

  console.log(selectedTop50);

  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // var filteredData;
  //
  // if (!filter) {
  //   filteredData = frequencyData;
  //   chargeStrength = 1;
  // }
  // if (filter) {
  //   filteredData = frequencyData.filter(function (d) {
  //     if (selectedTop50[d.Var1] != null) {
  //       return d;
  //     }
  //   });
  //   chargeStrength = 10;
  // }
  //
  // console.log(filteredData);

  // Create force simulation
  var force = d3.forceSimulation(frequencyData)
                .force("charge", d3.forceManyBody().strength(chargeStrength))
                .force("collide", d3.forceCollide(function (d) {
                  return radius(d.Freq) + 2;
                }))
                .force("center", d3.forceCenter().x(width/2).y(height/2));

  // Create bubbles
  bubble = svg.selectAll(".node")
          .data(frequencyData);

  bubble.enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
          return radius(d.Freq);
        })
        .merge(bubble)
            .attr("fill", function (d) {
              if (selectedTop50[d.Var1] != null) {
                return "#FF8F00";
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
                           "<br>" + uniqueSongData[d.Var1].artist_name +
                           "<br>Appears in <strong>" + d.Freq + "</strong> Top 50s"
                          )
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
                  })
        .on("mouseout", function(d) {
                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
        })
        .on("click", function (d) {

            var details = d3.select("#details");


            details.html("<strong>" + d.Var1 + "</strong>" +
                     "<br>Artist: " + uniqueSongData[d.Var1].artist_name +
                     "<br><br>Danceability: " + uniqueSongData[d.Var1].danceability +
                     "<br>Speechiness: " + uniqueSongData[d.Var1].speechiness +
                     "<br>Acousticness: " + uniqueSongData[d.Var1].acousticness +
                     "<br>Loudness: " + uniqueSongData[d.Var1].loudness +
                     "<br>Valence: " + uniqueSongData[d.Var1].valence);
        });



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

// function toggleBubbles() {
//   filter = !filter;
//   if (filter) {
//     d3.select('#filter-toggle').text("Show All of the World's Most Popular Music");
//
//     bubble.transition()
//         .duration(500)
//         .style("opacity", function (d) {
//           if (selectedTop50[d.Var1] == null) {
//             return 0;
//           }
//           else {
//             return 1;
//           }
//         });
//   }
//   else {
//     d3.select('#filter-toggle').text("Show Just Your Country's Top 50");
//
//     bubble.transition()
//         .duration(500)
//         .style("opacity", 1);
//   }
// }

// function toggleBubbles() {
//   var selectedCountry = d3.select("#countries-list").property("value");
//   filter = !filter;
//   if (filter) {
//     d3.select('#filter-toggle').text("Show the World's Most Popular Music");
//   }
//   if (!filter) {
//     d3.select('#filter-toggle').text("Show Your Country's Top 50");
//   }
//   updateBubbles(selectedCountry);
//   console.log("toggled");
// }


// Create scale for bubble chart just once
// var marginScale = {top: 20, right: 10, bottom: 20, left: 10},
//     widthScale = 280 - marginScale.left - marginScale.right,
//     heightScale = 120 - marginScale.top - marginScale.bottom;
//
// var svgScale = d3.select('#bubble-chart-scale').append('svg')
//     .attr('width', widthScale + marginScale.left + marginScale.right)
//     .attr('height', heightScale + marginScale.top + marginScale.bottom)
//   .append('g')
//     .attr('transform', 'translate(' + marginScale.left + ',' + marginScale.top + ')');
//
// function bubbleScale() {
//   var scaleTicks = [1,20,40,58];
//
//   // Create scale that determines radius of circles
//   var radius = d3.scaleLinear()
//                  .domain(d3.extent(frequencyData, function(d) { return d.Freq; }))
//                  .range([3, 60]);
//
//   svgScale.selectAll(".bubble-scale")
//           .data(scaleTicks).enter()
//           .append('circle')
//               .attr('cx', function (d, i) {
//                 return i * (radius(d) + 10);
//               })
//               .attr('cy', heightScale / 2)
//               .attr('r', function (d) {
//                 return radius(d);
//               })
//               .style('fill', '#d3d3d3');
//
// }
