// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const NUM_EXAMPLES = 200;

const margin = {
    top: 40,
    right: 100,
    bottom: 40,
    left: 175
};


// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 4) - 10,
    graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 4) - 10,
    graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2,
    graph_3_height = 575;

let svg = d3.select("#graph1")
    .append("svg")
    .attr("height", graph_1_height)
    .attr("width", graph_1_width)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef = svg.append("g");

let graph2svg = d3.select("#graph2")
    .append("svg")
    .attr("height", graph_2_height)
    .attr("width", graph_2_width)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let percentageRef = graph2svg.append("g")

let graph3svg = d3.select("#graph3")
    .append("svg")
    .attr("height", graph_3_height)
    .attr("width", graph_3_width)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


let y_axis_label = svg.append("g");

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1); // Improves readability

// y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate(${margin.left - 225}, ${margin.top - 45})`)
    .style("text-anchor", "middle");


// Add chart title
svg.append("text")
    .attr("transform", `translate(${margin.left + 150}, ${margin.top - 60})`)
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("font-weight", "bolder")
    .style("padding-bottom", "20px")
    .text("International Football Matches in Recent Years Vs Early 1900s");

//  x-axis label
svg.append("text")
    .attr("transform", `translate(${margin.left + 180}, ${margin.top + 150})`)
    .style("text-anchor", "middle")
    .text("Number of Matches");

//  Add y-axis title
svg.append("text")
    .attr("transform", `translate(${margin.left - 200}, ${margin.top - 45})`)
    .style("text-anchor", "middle")
    .text("Year");

function loadGraph1(filename) {

    d3.csv("./../data/" + filename).then(function (data) {

        console.log(data)

        let x = d3.scaleLinear()
            .domain([0, 1200])
            .range([0, graph_1_width - margin.left - margin.right]);

        y.domain(data.map(function (d) {
            return d.date;
        }));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg.selectAll("rect").data(data);

        // define color scale
        let color = d3.scaleOrdinal()
            .domain(data.map(function (d) {
                return d.date
            }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 6));


        bars.enter()
            .append("rect")
            .merge(bars).transition().duration(1000)
            .attr("fill", function (d) {
                return color(d.date)
            })
            .attr("x", x(0))
            .attr("y", function (d) {
                return y(d.date)
            })
            .attr("width", function (d) {
                return x(d.num_games)
            })
            .attr("height", y.bandwidth());


        let counts = countRef.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts).transition().duration(1000)
            .attr("x", function (d) {
                return 10 + x(d.num_games)
            })
            .attr("y", function (d) {
                return 10 + y(d.date)
            })
            .style("text-anchor", "start")
            .text(function (d) {
                return d.num_games
            });


        bars.exit().remove();
        counts.exit().remove();
    });
}

d3.csv("./../data/football.csv").then(function (data) {

    //Chart 2: Winning Percentage
    data = winningData(data).slice(0, 10)

    let graph2x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.percentage;
        })])
        .range([0, graph_2_width - margin.left - margin.right]);


    let graph2y = d3.scaleBand()
        .domain(data.map(function (d) {
            return d.name;
        }))
        .range([0, graph_2_height - margin.top - margin.bottom])
        .padding(0.1);

    graph2svg.append("g")
        .call(d3.axisLeft(graph2y).tickSize(0).tickPadding(10));

    let graph2bars = graph2svg.selectAll("rect").data(data);

    // define color scale
    color = d3.scaleOrdinal()
        .domain(data.map(function (d) {
            return d.name
        }))
        .range(d3.quantize(d3.interpolateHcl("#3cb043", "#028A0F"), 10));

    graph2bars.enter()
        .append("rect")
        .merge(graph2bars).transition().duration(1000)
        .attr("fill", function (d) {
            return color(d.name)
        })
        .attr("x", graph2x(0))
        .attr("y", function (d) {
            return graph2y(d.name)
        })
        .attr("width", function (d) {
            return graph2x(d.percentage)
        })
        .attr("height", graph2y.bandwidth());


    let percentage = percentageRef.selectAll("text").data(data);

    percentage.enter()
        .append("text")
        .merge(percentage).transition().duration(1000)
        .attr("x", function (d) {
            return 10 + graph2x(d.percentage)
        })
        .attr("y", function (d) {
            return 10 + graph2y(d.name)
        }).style("text-anchor", "start")
        .text(function (d) {
            return d.percentage + "%"
        });


    // TODO: Add x-axis label
    graph2svg.append("text")
        .attr("transform", `translate(${margin.left + 150}, ${margin.top + 190})`)
        .style("text-anchor", "middle")
        .text("Winning Percentage");

    // TODO: Add y-axis label
    graph2svg.append("text")
        .attr("transform", `translate(${margin.left - 205}, ${margin.top - 45})`)
        .style("text-anchor", "middle")
        .text("Country");

    // TODO: Add chart title
    graph2svg.append("text")
        .attr("transform", `translate(${margin.left + 150}, ${margin.top - 60})`)
        .style("text-anchor", "middle")
        .style("font-size", 20)
        .style("font-weight", "bolder")
        .text("Winning Percentage of top 10 Countries of All Time");
});

function winningData(data) {
    let games = {}
    let winningRecords = []
    for (const d of data) {

        var hometeam = d.home_team;
        var awayteam = d.away_team;

        //count games
        if (hometeam in games) {
            games[hometeam][0] = games[hometeam][0] + 1;
        } else {
            games[hometeam] = [1]
        }

        if (awayteam in games) {
            games[awayteam][0] = games[awayteam][0] + 1
        } else {
            games[awayteam] = [1]
        }

        var score = d.home_score - d.away_score;

        //count wins
        if (score == 0) {
            continue;
        } else if (score > 0) {

            if (games[hometeam].length > 1) {
                games[hometeam][1] = games[hometeam][1] + 1
            } else {
                games[hometeam].push(1)
            }

        } else {
            if (games[awayteam].length > 1) {
                games[awayteam][1] = games[awayteam][1] + 1
            } else {
                games[awayteam].push(1)
            }
        }

    }

    //get winning percentage of countries
    for (var key in games) {
        var country = new Object();
        country.name = key
        country.percentage = Math.round(((games[key][1] / games[key][0]) + Number.EPSILON) * 100) / 100
        country.percentage = Math.round(country.percentage * 100)

        winningRecords.push(country)
    }

    //ten with highest win percentage
    var top10 = winningRecords.sort(function (a, b) {
        return b.percentage - a.percentage;
    });

    var filtered = top10.filter(function (value) {

        return value.name !== "Asturias" && value.name !== "Basque Country" && value.name !== "Andalusia" && value.name !== "Kernow" && value.name !== "New Caledonia" && value.name !== "Tahiti";
    });


    return filtered;
}

d3.csv("./../data/worldcup.csv").then(
    function (data) {

        data = winningData(data, false).filter(function (value) {
            return isNaN(value.percentage) == false
        });
        //console.log(data)

        let layout = d3.layout.cloud()
            .size([graph_3_width / 2, graph_3_height])
            .words(data.map(function (d) {
                return {
                    text: d.name,
                    size: d.percentage
                };
            }))
            .padding(4)
            .rotate(0)
            .fontSize(function (d) {
                return d.size;
            })
            .on("end", draw);
        layout.start();

        function draw(words) {


            var tooltip = d3.select("#graph3").append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "#3895d3")
                .style("border", "solid")
                .style("color", "white")
                .style("font-weight", "bolder")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")



            var mouseover = function (d) {
                tooltip
                    .style("opacity", 1)
            }

            var mousemove = function (d) {
                tooltip
                    .html(d.text + "'s " + "winning Percentage: " + d.size + "%")
                    .style("left", d3.select(this).attr("cx") + "px")
                    .style("top", d3.select(this).attr("cy") + "px");
            }


            var mouseleave = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }


            var color = d3.scaleOrdinal()
                .domain(data.map(function (d) {
                    return d.percentage
                }))
                .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 40));

            graph3svg.append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .attr("id", "wordCloud")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .style("font-size", function (d) {

                    return (d.size / 100) * (d.size / 100) * 5 + "px";
                })
                .style("fill", function (d) {
                    return color(d.size);
                })
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {

                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                }).transition()
                .duration(900)
                .style("font-size", function (d) {
                    return (d.size / 100) * (d.size / 100) * 100 + "px";
                })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1)
                .text(function (d) {
                    return d.text;
                });

        }

    });

loadGraph1("recent.csv")