/* main JS file */

// Global variables for data
var audioData;
var frequencyData;
var mapData;
var mapNameData;
var dataByCountry = {};
var uniqueSongData = {};
var countryAvgAttributes;

var selectedCountry;

var comparisonChart;
var sliderVis;
var choroplethMap;
var introMap;
var bubbleChart;



$(document).ready(function() {

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
            mapNameData = data4;

            // Organize data by countries
            nestedByCountry = d3.nest()
                .key(function(d, i) { return d.playlist_name.replace(" Top 50", ""); })
                .rollup(function (d) { return d; })
                .entries(audioData);

            nestedByCountry.forEach(function(d) {
                dataByCountry[d.key] = d.value;
            });

            audioData.forEach(function(d) {
                if (uniqueSongData[d.track_name] == null) {
                    uniqueSongData[d.track_name] = d;
                }
            });

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

            // console.log(countryAvgAttributes);

            // console.log(audioData, frequencyData, mapData, dataByCountry, data4);
            // console.log(uniqueSongData);

            // Initialize intro map
            introMap = new IntroMap("intro-map", countryAvgAttributes, data3, data4);

            // Initialize comparison chart
            comparisonChart = new ComparisonChart("comparison-chart", audioData);

            // Initial bubble chart
            // bubbleScale();
            updateBubbles("United States");

            sliderVis = new SliderVis("slider-chart", audioData, countryAvgAttributes, mapData, mapNameData);

            choroplethMap = new ChoroplethVis("choropleth-map", countryAvgAttributes, data3, data4);

        });

    $('#fullpage').fullpage({
        // sectionsColor: ['#B8AE9C', '#348899', '#F2AE72', '#5C832F', '#B8B89F'],
        sectionSelector: '.vertical-scrolling',
        navigation: true,
        css3: true,
        controlArrows: false,
        // autoScrolling: false,
        // scrollBar: true,
        anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'fifthSection',
            'sixthSection', 'seventhSection', 'eighthSection', 'ninthSection', 'tenthSection'],
        // menu: '#menu',

        // afterLoad: function(anchorLink, index) {},
        // onLeave: function(index, nextIndex) {},

        /*afterLoad: function (anchorLink, index) {
            $header_top.css('background', 'rgba(0, 47, 77, .3)');
            $nav.css('background', 'rgba(0, 47, 77, .25)');
            if (index == 5) {
                $('#fp-nav').hide();
            }
        },

        onLeave: function (index, nextIndex, direction) {
            if (index == 5) {
                $('#fp-nav').show();
            }
        },*/

    });
});

function updateSelected() {
    selectedCountry = d3.select("#countries-list").property("value");
    comparisonChart.onCountryCompareChange();
    // updateBubbles(selectedCountry);
}
