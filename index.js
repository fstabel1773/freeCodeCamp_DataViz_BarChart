import * as d3 from "https://unpkg.com/d3?module";

const date = new Date("2022-01-03");
console.log(date);

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((res) => {
    if (!res.ok) {
      throw new Error(response.statusText);
    }
    return res.json();
  })
  .then((data) => {
    // console.log(data);
    const dataset = data.data;
    // console.log(dataset);

    const w = 700;
    const h = 700;
    const padding = 50;
    const barwidth = (w - 2 * padding) / dataset.length;

    // const xScale = d3
    //   .scaleLinear()
    //   .domain([d3.min(dataset, (d, i) => i), d3.max(dataset, (d, i) => i)])
    //   .range([padding, w - padding]);

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, (d, i) => {
          return new Date(d[0]);
        }),
        d3.max(dataset, (d, i) => {
          return new Date(d[0]);
        }),
      ])
      .range([padding, w - padding]);

    const xAxis = d3.axisBottom(xScale);

    // var y = d3.scale.linear()
    // .range([height, 0])
    // .domain([0, d3.max(data, function(d) { return d[1]; })]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    const yAxis = d3.axisLeft(yScale);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("id", "container")
      .attr("width", w)
      .attr("height", h);

    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", padding)
      .attr("text-anchor", "middle")
      .attr("id", "title")
      .text("United States GDP");

    svg
      .append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const mouseenter = (event, d) => {
      tooltip.style("opacity", 1);
    };

    const mouseleave = (event, d) => {
      tooltip.transition().duration(500).style("opacity", 0);
    };

    const mousemove = (event, d) => {
      const [a, b] = d3.pointer(event);
      const dataDate = new Date(d[0]);
      const year = dataDate.getFullYear();
      const quarter = Math.floor((dataDate.getMonth() + 3) / 3);
      const gdp = `$ ${d[1]} Billion`;

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(`<p> ${year} Q${quarter}<p><h2>${gdp}</h2>`)
        .attr("data-date", d[0])
        .style("left", a + "px")
        .style("top", b + "px");
    };

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => padding + i * barwidth)
      .attr("y", (d, i) => yScale(d[1]))
      .attr("width", barwidth)
      .attr("height", (d, i) => h - padding - yScale(d[1]))
      .attr("fill", "#a4161a")
      .attr("class", "bar")
      .attr("data-date", (d, i) => d[0])
      .attr("data-gdp", (d, i) => d[1])
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseenter", mouseenter);
    // .append("title")
    // .text((d) => {
    //   return d[0].slice(0, 4);
    // });
  })
  .catch((error) =>
    console.log("Not able to fetch the data. There was an error: ", error)
  );
