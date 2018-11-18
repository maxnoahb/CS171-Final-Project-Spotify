/* main JS file */

// Global variables for data
var audioData;
var frequencyData;
var mapData;

// Load in data
d3.queue()
    .defer(d3.csv, 'data/audio_features.csv')
    .defer(d3.csv, 'data/track_frequencies.csv')
    .defer(d3.json, 'data/world-110m.json')
    .await(function(error, data1, data2, data3) {
        console.log(data1, data2, data3);

        audioData = data1;
        frequencyData = data2;
        mapData = data3;

        // Initial bubble chart
        initializeBubbles();

        // Initialize slider chart
        var sliderVis = new SliderVis("slider-chart", data1);

    });
