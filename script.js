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
  .range([0, graph.height]); // The range of Y axis positions for dots on the graph

// Create axis objects for rendering each axis
// Each is passed the corresponding scale for rendering the axis ticks
const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

const yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

// Create a SVG to be used as the graph
const svg = d3.select('#graph').append('svg') // Add a SVG into the HTML element with ID 'graph'
  .attr('width', dimensions.width)                                  // Set SVG width
  .attr('height', dimensions.height)                                // Set SVG height
  .append('g')                                                      // Append an SVG group to contain the dots
    .attr('transform', `translate(${margin.left}, ${margin.top})`); // Move the group to allow for the margins

// Read CSV data from an external data source
// Once done, run the code in the callback function to use the data
d3.csv('data/basic.csv', (error, data) => {

  // If something went wrong, raise an error (code in this function will go no further)
  if (error) throw error;

  // CSV files only contain text
  // Convert numeric strings in each data point into actual numbers
  data.forEach((d) => {
    d.x = Number(d.x);
    d.y = Number(d.y);
  });

  // Set the domain for the axes' linear scales
  // Limit it to the extent of the data
  // This makes the graph only show the 'area' that the data occupies
  // 'nice' makes the domain start and end at round, sensible numbers
  x.domain(d3.extent(data, d => d.x)).nice();
  y.domain(d3.extent(data, d => d.y)).nice();

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
      .text('X Value');                                 // Set the text to show as the axis's label

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
      .text('Y Value');                                 // Set the text to show as the axis's label

  // Add a dot to the SVG for each data point
  svg.selectAll('.dot')         // Select any existing elements with class 'dot'
    .data(data)                 // Add data from 'data' variable to the selection
    .enter().append('circle')   // For each selected piece of data, create a circle
      .attr('class', 'dot')     // Give it the CSS class 'dot'
      .attr('r', 3.5)           // Make its radius 3.5 pixels
      .attr('cx', d => x(d.x))  // Use 'x' linear scale to position circle's centre on the X axis
      .attr('cy', d => y(d.y)); // Use 'y' linear scale to position circle's centre on the Y axis
});
