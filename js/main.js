/* main JS file */

// Global variables for data
var audioData;
var frequencyData;
var mapData;

var comparisonChart;

// Load in data
d3.queue()
    .defer(d3.csv, 'data/audio_features.csv')
    .defer(d3.csv, 'data/track_frequencies.csv')
    .defer(d3.json, 'data/world-110m.json')
    .await(function(error, data1, data2, data3) {

        // Convert numStrings to numbers
        data1.forEach(function(d) {
          d.acousticness = +d.acousticness;
          d.danceability = +d.danceability;
          d.duration_ms = +d.duration_ms;
          d.energy = +d.energy;
          d.instrumentalness = +d.instrumentalness;
          d.liveness = +d.liveness;
          d.loudness = +d.loudness;
          d.speechiness = +d.speechiness;
          d.tempo = +d.tempo;
          d.valence = +d.valence;
        });

        data2.forEach(function(d) {
          d.Freq = +d.Freq;
        });

        audioData = data1;
        frequencyData = data2;
        mapData = data3;

        console.log(audioData, frequencyData, mapData);

        // Initial bubble chart
        initializeBubbles();

        // Initialize slider chart
        initializeSliderChart();

        // Initialize comparison chart
        comparisonChart = new ComparisonChart("comparison-chart", audioData);

        var sliderVis = new SliderVis("slider-chart", data1);

    });
