const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    // Populate the dropdown with the list of sample names
    d3.json(sampleUrl).then((data) => {
        const sampleNames = data.names
        const dropDown = d3.select("#selDataset")
        for (let i = 0; i < sampleNames.length; i++) {
            dropDown.append("option").text(sampleNames[i]).property("value", sampleNames[i])
        }
        // Display plot and metadata for first sample
        buildCharts(sampleNames[0])
        buildMetadata(sampleNames[0])
        buildGauge(sampleNames[0])
    })
}

function buildCharts(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const samples = data.samples
        const results = samples.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)

        let ids = results.otu_ids
        let labels = results.otu_labels
        let values = results.sample_values
        let wfreq = results.wfreq

        //  Build bar chart
        let bar_data = [{
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0, 10).reverse(),
            text: labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }]

        let barLayout = {
            margin: { t: 0, l: 150 }
        }

        Plotly.newPlot("bar", bar_data, barLayout)

        // Build bubble chart
        let layoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
        }

        let dataBubble = [{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                colorscale: 'Earth',
                size: values,
            }
        }]

        Plotly.newPlot("bubble", dataBubble, layoutBubble)

    })
}

// Populate demographic info tile
function buildMetadata(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const metadata = data.metadata
        const results = metadata.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)

        let tile = d3.select("#sample-metadata")
        tile.html("")
        Object.entries(results).forEach(([key, value]) => {
            tile.append("h6").text(`${key}: ${value}`)
        })
    })
}

// Build gauge chart
function buildGauge(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const metadata = data.metadata
        const results = metadata.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)

        //Calculate coordinates of needle
        const degrees = 180 - (results.wfreq) * (180 / 10)
        const radius = 0.25
        const radians = degrees * Math.PI / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);

        // Creat closed triangular shape for needle
        let needleBase = 'M 0.5 0.5 L 0.5 0.55 L '
        let pathX = String(0.5 + x)
        let pathY = String(0.5 + y)
        let needlePath = needleBase.concat(pathX, " ", pathY, ' Z')
        console.log(needlePath)

        let needle = {
            shapes: [
                {
                    type: "path",
                    path: needlePath,
                    fillcolor: "#800000",
                    line: {
                        color: "#800000"
                    }
                }
            ],
            title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
            xaxis: {
                showticklabels: false,
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                showticklabels: false,
                showgrid: false,
                zeroline: false
            },
            autosize: false,
            width: 550,
            height: 550,
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 100,
                pad: 4
            }
        }

        // Create dial of gauge from pie chart
        let gauge = [{
            type: 'pie',
            x: [2.5], y: [2.5],
            marker: { size: 5, color: '#800000' },
            showlegend: false,
        },
        {
            values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition: 'inside',
            textfont: { size: 14 },
            marker: { colors: ['#6b8e23', '#7c9a3e', '#8da656', '#9eb36d', '#afbf85', '#becb9c', '#cfd9b5', '#dfe5cd', '#eff2e5', '#ffffff'] },
            hole: .5,
            type: 'pie',
            showlegend: false
        }]

        Plotly.newPlot('gauge', gauge, needle)
    }
    )
}

// Get new data each time a new sample is selected
function optionChanged(newSample) {
    buildCharts(newSample)
    buildMetadata(newSample)
    buildGauge(newSample)
}

// Initialize the dashboard with data
init()