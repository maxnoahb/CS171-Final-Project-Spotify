/* main JS file */

// Global variables for data
var audioData;
var frequencyData;
var mapData;
var dataByCountry;
var countryAvgAttributes;

var selectedCountry;
var selectedTop50;

var comparisonChart;
var choroplethMap;

// Load in data
d3.queue()
    .defer(d3.csv, 'data/audio_features.csv')
    .defer(d3.csv, 'data/track_frequencies.csv')
    .defer(d3.json, 'data/world-110m.json')
    .defer(d3.tsv, 'data/world-110m-names.tsv')
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
        });

        data2.forEach(function(d) {
          d.Freq = +d.Freq;
        });

        audioData = data1;
        frequencyData = data2;
        mapData = data3;

        // Organize data by countries
        dataByCountry = d3.nest()
            .key(function(d, i) { return d.playlist_name.replace(" Top 50", ""); })
            .rollup(function (d) { return d; })
            .entries(audioData);

        // new data structure containing the average attributes for each country playlist
        countryAvgAttributes = d3.nest()
            .key(function(d) { return d.playlist_name; })
            .rollup(function(v) {
                return {
                    "acousticness": d3.mean(v, function(d) { return d.acousticness; }),
                    "danceability": d3.mean(v, function(d) { return d.danceability; }),
                    "duration_ms": d3.mean(v, function(d) { return d.duration_ms; }),
                    "energy": d3.mean(v, function(d) { return d.energy; }),
                    "liveness": d3.mean(v, function(d) { return d.liveness; }),
                    "loudness": d3.mean(v, function(d) { return d.loudness; }),
                    "speechiness": d3.mean(v, function(d) { return d.speechiness; }),
                    "tempo": d3.mean(v, function(d) { return d.tempo; }),
                    "valence": d3.mean(v, function(d) { return d.valence; })
                };
            })
            .entries(data1);

        console.log(audioData, frequencyData, mapData, dataByCountry);

        // Initial bubble chart
        updateBubbles();

        // Initialize comparison chart
        comparisonChart = new ComparisonChart("comparison-chart", audioData);

        var sliderVis = new SliderVis("slider-chart", data1);

        choroplethMap = new ChoroplethVis("choropleth-map", countryAvgAttributes, data3, data4)

    });

    function updateSelected() {
       selectedCountry = d3.select("#countries-list").property("value");
       var selectedData = dataByCountry.filter(function (d) {
        return d.key == selectedCountry;
      });
       selectedTop50 = selectedData[0].value;

      comparisonChart.onCountryCompareChange();
      updateBubbles();
    }
