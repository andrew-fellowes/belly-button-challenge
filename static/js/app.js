const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    d3.json(sampleUrl).then((data) => {
        const sampleNames = data.names
        const dropDown = d3.select("#selDataset")
        for (let i = 0; i < sampleNames.length; i++) {
            dropDown.append("option").text(sampleNames[i]).property("value", sampleNames[i])
        }
        buildcharts(sampleNames[0])
        buildmetadata(sampleNames[0])
    })
}

function buildcharts(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const samples = data.samples
        const results = samples.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)
    })
}

function buildmetadata(sampleId) {
    d3.json(sampleUrl).then((data) => {
        const metadata = data.metadata
        const results = metadata.filter(sampleObj => sampleObj.id == sampleId)[0]
        console.log(results)
    })
}

function optionChanged(newSample) {
    buildcharts(newSample)
    buildmetadata(newSample)
}

init()