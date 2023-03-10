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
    const dataset = data.data;

    // compute windwoWidth
    let windowWidth = document.querySelector("body").clientWidth;
    let windowHeight = document.querySelector("body").clientHeight;
    window.addEventListener("resize", () => {
      windowWidth = document.querySelector("body").clientWidth;
      windowHeight = document.querySelector("body").clientHeight;
    });

    // layout variables
    const w = 1000;
    const h = 700;
    const padding = 50;
    const barwidth = (w - 2 * padding) / dataset.length;

    //svg container
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

    // scales
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

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    // axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

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

    // tooltip
    const tooltip = d3
      .select("body")
      .append("g")
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
        .html(`<p>${year} Q${quarter}</p><h2>${gdp}</h2>`)
        .attr("data-date", d[0])
        .style("left", (windowWidth - w) / 2 + a + 20 + "px")
        .style("top", (windowHeight - h) / 2 + b - 100 + "px");
    };

    // bars
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      // .attr("x", (d, i) => padding + i * barwidth)
      .attr("x", (d, i) => xScale(new Date(d[0])))
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
  })
  .catch((error) =>
    console.log("Not able to fetch the data. There was an error: ", error)
  );
