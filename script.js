// D3.js XY scatterplot script

// Define the size of the SVG containing the graph and its axes
const dimensions = { width: 750, height: 750 };

// Define the margins that provide padding and space for the axes
const margin = { top: 20, right: 20, bottom: 30, left: 30 };

// Define the size of the chart area, computed from the SVG size minus margins
const graph = {
  width: dimensions.width - margin.left - margin.right,
  height: dimensions.height - margin.top - margin.bottom
};

// Create linear scales for both data axes
// These convert the data values into numbers used to draw dots on the graph
const x = d3.scale.linear()
  .range([0, graph.width]); // The range of X axis positions for dots on the graph

const y = d3.scale.linear()
  .range([graph.height, 0]); // The range of Y axis positions for dots on the graph

// Create axis objects for rendering each axis
// Each is passed the corresponding scale for rendering the axis ticks
const xAxis = d3.svg.axis()
  .scale(x)                      // Use the 'x' linear scale for ticks
  .orient('bottom')              // Render as a bottom axis
  .tickFormat(d => d / 1000000); // Show each tick's value as millions

const yAxis = d3.svg.axis()
  .scale(y)                      // Use the 'y' linear scale for ticks
  .orient('left')                // Render as a left axis
  .tickFormat(d => d / 1000000); // Show each tick's value as millions

// Create a colour scale to represent each film's metascore
const colour = d3.scale.linear()
  .domain([0, 50, 100])           // A fixed domain from 0 to 100 with a step at 50
  .interpolate(d3.interpolateHcl) // Use a preset way of mixing any colour in the range
  .range([
    d3.rgb('#ff0000'),            // Films with a metascore of 0 will be red
    d3.rgb('#ffff00'),            // Films with a metascore of 50 will be yellow
    d3.rgb('#00ff00')             // Films with a metascore of 100 will be green
  ]);

// Create a tooltip to display info about the film being looked at
const tooltip = d3.select('#graph').append('div') // Add a div into the HTML element with ID 'graph'
  .attr('class', 'tooltip')                       // Give it the 'tooltip' class
  .style('opacity', 0);                           // Make it invisible using the CSS 'opacity' property

// Create a SVG to be used as the graph
const svg = d3.select('#graph').append('svg') // Add a SVG into the HTML element with ID 'graph'
  .attr('width', dimensions.width)                                  // Set SVG width
  .attr('height', dimensions.height)                                // Set SVG height
  .append('g')                                                      // Append an SVG group to contain the dots
    .attr('transform', `translate(${margin.left}, ${margin.top})`); // Move the group to allow for the margins

// Read CSV data from an external data source
// Once done, run the code in the callback function to use the data
d3.csv('data/imdb.csv', (error, data) => {

  // If something went wrong, raise an error (code in this function will go no further)
  if (error) throw error;

  // CSV files only contain text
  // Convert numeric strings in each data point into actual numbers
  data.forEach((d) => {
    d.budget = Number(d.budget);
    d.gross = Number(d.gross);
  });

  // Set the domain for the axes' linear scales
  // Limit it to the extent of the data
  // This makes the graph only show the 'area' that the data occupies
  // 'nice' makes the domain start and end at round, sensible numbers
  x.domain(d3.extent(data, d => d.budget)).nice();
  y.domain(d3.extent(data, d => d.gross)).nice();

  // Render the X axis for the graph
  svg.append('g')                                       // Append an SVG group to contain the axis
    .attr('class', 'x axis')                            // Give it the 'x' and 'axis' classes
    .attr('transform', `translate(0, ${graph.height})`) // Position it below the graph
    .call(xAxis)                                        // Use the 'xAxis' object to render the axis
    .append('text')                                     // Append a text object to the axis
      .attr('class', 'label')                           // Give it the 'label' class
      .attr('x', graph.width)                           // Position it at the end of the axis
      .attr('y', -6)                                    // Position it just above the axis
      .style('text-anchor', 'end')                      // Make sure the text lines up with the end of the axis
      .text('Estimated Budget ($1m)');                  // Set the text to show as the axis's label

  // Render the Y axis for the graph
  svg.append('g')                                       // Append an SVG group to contain the axis
    .attr('class', 'y axis')                            // Give it the 'y' and 'axis' classes
    .call(yAxis)                                        // Use the 'yAxis' object to render the axis
    .append('text')                                     // Append a text object to the axis
      .attr('class', 'label')                           // Give it the 'label' class
      .attr('transform', 'rotate(-90)')                 // Rotate the text to display in line with the axis
      .attr('y', 6)                                     // Position it to the right of the axis
      .attr('dy', '0.71em')                             // Position it to the right relative to its font size
      .style('text-anchor', 'end')                      // Make sure the text lines up with the top of the axis
      .text('Worldwide Gross ($1m)');                   // Set the text to show as the axis's label

  // Add a dot to the SVG for each data point
  svg.selectAll('.dot')             // Select any existing elements with class 'dot'
    .data(data)                     // Add data from 'data' variable to the selection
    .enter().append('circle')       // For each selected piece of data, create a circle
      .attr('class', 'dot')         // Give it the CSS class 'dot'
      .attr('r', 3.5)               // Make its radius 3.5 pixels
      .attr('cx', d => x(d.budget)) // Use 'x' linear scale to position circle's centre on the X axis
      .attr('cy', d => y(d.gross))  // Use 'y' linear scale to position circle's centre on the Y axis
      .style('fill', d => colour(d.metascore)) // Use the colour scale to colour the dot based on metascore
      .on('mouseover', (d) => {     // Perform actions when a dot is moused over
        tooltip.transition()        // Quickly fade the tooltip into visibility
          .duration(200)
          .style('opacity', 1);
        tooltip.html(`${d.name} (${d.metascore}%)`) // Display the film's name and metascore next to the dot
          .style('left', `${d3.event.pageX + 3.5}px`)
          .style('top', `${d3.event.pageY - 18.5}px`);
      })
      .on('mouseout', (d) => {      // Perform actions when a dot is moused away from
        tooltip.transition()        // Make the tooltip invisible again
          .duration(500)
          .style('opacity', 0);
      });
});
