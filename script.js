// D3.js XY scatterplot script

// Define the size of the chart area
const graph = {
  width: 500,
  height: 500
};

// Create a SVG to be used as the graph
const svg = d3.select('#graph').append('svg') // Add a SVG into the HTML element with ID 'graph'
  .attr('width', graph.width)                 // Set SVG width
  .attr('height', graph.height);              // Set SVG height

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

  // Add a dot to the SVG for each data point
  svg.selectAll('.dot')       // Select any existing elements with class 'dot'
    .data(data)               // Add data from 'data' variable to the selection
    .enter().append('circle') // For each selected piece of data, create a circle
      .attr('class', 'dot')   // Give it the CSS class 'dot'
      .attr('r', 3.5)         // Make its radius 3.5 pixels
      .attr('cx', d => d.x)   // Use data 'x' value to position circle's centre on the X axis
      .attr('cy', d => d.y);  // Use data 'y' value to position circle's centre on the Y axis
});
