
/*  Asylum Same Bar Charts*/

const url = "https://script.google.com/macros/s/AKfycbytQHIRHVuI9dQugwZ8ZPpDpF4L_dDjKbq1gtAk8NWNgsXOS-x3/exec?topic=AsylumDecisions"

fetch(url).then(response =>
    response.json().then(data => ({
        data: data,
        status: response.status
    })
    ).then(res => {
        makeGraphs(res.data)
    })
);

function makeGraphs(data) {
    data = dataConversion(data)

    /* Here we will put which graphs we want to make */
    AsylumDescisionPerYearBarChart(data)
    AsylumDescisionPerYearLineChart(data)
    AsylumHeatMap(data)


    dc.renderAll(); /* Finally we draw the Charts */
}

function dataConversion(data) {
    var cleanData = []
    for(let d in data) {
        var ageRangeObj  = {}
        var sortedKeys = Object.keys(data[d]).reverse();
        for(let v in sortedKeys) {
            var n = sortedKeys[v]
            if(Object.keys(ageRangeObj).length === 4 || Object.keys(ageRangeObj).length > 4){
                ageRangeObj['year'] = n
                ageRangeObj['count'] = data[d][n]
                var dataPerYear = JSON.stringify(ageRangeObj)
                cleanData.push(JSON.parse(dataPerYear))
            } else {
                ageRangeObj[n] = data[d][n]
            }
        }
    }
    return cleanData
}


/* AsylumDescisionPerYear */

function AsylumDescisionPerYearBarChart(data) {
    var ndx = crossfilter(data)
    var countryDim = ndx.dimension(dc.pluck("year"));
    var countryMix = countryDim.group().reduceSum(dc.pluck("count"))
    dc.barChart("#AsylumDescisionPerYear")
        .width(1550)
        .height(550)
        .margins({top: 20, right: 50, bottom: 100, left: 80})
        .dimension(countryDim)
        .group(countryMix)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Total Asylum Descisions made")
        .yAxis().ticks(20);
}
/* #AsylumDescisionLine */
function AsylumDescisionPerYearLineChart(data) {
    var ndx = crossfilter(data)
    var yearDim = ndx.dimension(dc.pluck("year"));
    var yearGroup = yearDim.group().reduceSum(dc.pluck("count"))
    var chart = dc.lineChart("#AsylumDescisionLine")
        .width(1800)
        .height(500)
        .margins({top: 20, right: 50, bottom: 100, left: 80})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Year')
        .yAxisLabel('Total Asylum Decisions made')
        .dimension(yearDim)
        .group(yearGroup)
}

/* #AsylumDescisionHeatMap */

function AsylumheatMap(experiments) {
    console.log(experiments)
    var ndx    = crossfilter(experiments),
        runDim = ndx.dimension(function(d) {return [d.country, d.year]; }),
        runGroup = runDim.group().reduceSum(function(d) { return d.count });
    console.log(runGroup.all())
    var chart = dc.heatMap("#AsylumDescisionHeatMap")
        .width(1800)
        .height(500)
        .dimension(runDim)
        .group(runGroup)
        .keyAccessor(function(d) {
            console.log(d)
            return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colorAccessor(function(d) { return +d.value; })
        .title(function(d) {
            return "Run:   " + d.key[0] + "\n" +
                "Expt:  " + d.key[1] + "\n" +
                "Speed: " + d.value})
        .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
        .calculateColorDomain();
    }