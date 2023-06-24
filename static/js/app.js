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
    })
}

function buildCharts(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const samples = data.samples
        const results = samples.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)

        let ids = results.otu_ids;
        let labels = results.otu_labels;
        let values = results.sample_values;

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
                size: values,
            }
        }]

        Plotly.newPlot("bubble", dataBubble, layoutBubble)

    })
}

function buildMetadata(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const metadata = data.metadata
        const results = metadata.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)

        let panel = d3.select("#sample-metadata")
        panel.html("")
        Object.entries(results).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`)
        })
    })
}

function optionChanged(newSample) {
    // Get new data each time a new sample is selected
    buildCharts(newSample)
    buildMetadata(newSample)
}

// Initialize the dashboard with data
init()