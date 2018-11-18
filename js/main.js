/* main JS file */

// Global variables for data
var audioData;
var frequencyData;
var mapData;
var countryNames;

var comparisonChart;

// Load in data
d3.queue()
    .defer(d3.csv, 'data/audio_features.csv')
    .defer(d3.csv, 'data/track_frequencies.csv')
    .defer(d3.json, 'data/world-110m.json')
    .defer(d3.tsv, 'data/world-100m-names.tsv')
    .await(function(error, data1, data2, data3, data4) {

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
          // Create a new column for country name
          d.country = d.playlist_name.replace(" Top 50","");
        });

        data2.forEach(function(d) {
          d.Freq = +d.Freq;
        });

        // Get country names and corresponding ID for map
        countryNames = d3.map();
        data4.forEach(function(d){
            countryNames.set(d.id,d.name);
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

        // Initialize choropleth chart
        var choroplethVis = new ChoroplethVis("choropleth-map", audioData, mapData, countryNames);


    });
