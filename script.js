// D3.js XY scatterplot script

// Define the size of the chart area
const graph = {
  width: 500,
  height: 500
};

// Basic and arbitrary data points
const data = [
  { x: 25, y: 25 },
  { x: 50, y: 75 },
  { x: 100, y: 150 },
  { x: 200, y: 300 }
];

// Create a SVG to be used as the graph
const svg = d3.select('#graph').append('svg') // Add a SVG into the HTML element with ID 'graph'
  .attr('width', graph.width)                 // Set SVG width
  .attr('height', graph.height);              // Set SVG height

// Add a dot to the SVG for each data point
svg.selectAll('.dot')       // Select any existing elements with class 'dot'
  .data(data)               // Add data from 'data' variable to the selection
  .enter().append('circle') // For each selected piece of data, create a circle
    .attr('class', 'dot')   // Give it the CSS class 'dot'
    .attr('r', 3.5)         // Make its radius 3.5 pixels
    .attr('cx', d => d.x)   // Use data 'x' value to position circle's centre on the X axis
    .attr('cy', d => d.y);  // Use data 'y' value to position circle's centre on the Y axis
