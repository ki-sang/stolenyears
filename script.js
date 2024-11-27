// Select the SVG canvas and set it to full screen
const width = window.innerWidth;  // Full width of the window
const height = window.innerHeight;  // Full height of the window

const svg = d3.select("#svgCanvas")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "black") // Set the background to black
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Define maximum radius (life expectancy) for scaling the line length
const maxRadius = Math.min(width, height) * 0.35;  // 35% of the screen size

// Read the CSV and extract the data
d3.csv("killed-in-gaza.csv").then(function(data) {
  // Ensure the 'age' column is numeric and filter out invalid or missing ages
  data = data.filter(d => !isNaN(d.age) && +d.age > 0);
  
  // Calculate the stolen years (75 - age) and scale it to the available radius
  const stolenYears = data.map(d => 75 - +d.age); // 75 is the life expectancy

  // Shuffle the stolen years to randomize the order
  const shuffledStolenYears = stolenYears.sort(() => Math.random() - 0.5);  // Randomize order

  // Scale stolen years to fit within the max radius
  const scale = d3.scaleLinear()
    .domain([0, 75])  // domain: from 0 years to 75 years
    .range([0, maxRadius]);  // range: scaled to the max radius

  // Create a radial graph for each stolen year (a line representing a person)
  const totalLines = shuffledStolenYears.length;

  // Set the angleStep to 0.3 degrees (spacing between lines)
  const angleStep = 0.3 * Math.PI / 180;  // 0.3 degrees in radians

  // Create lines for each person
  const lines = svg.selectAll("line")
    .data(shuffledStolenYears)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0) // Initially, x2 is 0
    .attr("y2", 0) // Initially, y2 is 0
    .attr("stroke", function(d) {
      // Color people aged 18 and below in red, others in white
      return d <= 18 ? "red" : "white";  // Set color based on age
    })
    .attr("stroke-width", .3)  // Thinner lines for better readability
    .attr("opacity", 0) // Start with opacity 0 for the animation effect
    .transition()
    .duration(function(d, i) {
      // First line: slow (3 seconds), others fast (500ms)
      return i === 0 ? 6000 : 500;  // First line: 3000ms, others: 500ms
    })
    .delay(function(d, i) {
      // No need for sequential waiting, just a slight delay
      return i * 10;  // Delay each line by 50ms after the first
    })
    .attr("opacity", 0.2) // Make the line more transparent to allow stacking
    .attr("x2", (d, i) => {
      // Animate in a clockwise direction
      const angle = i * angleStep;  // Only clockwise animation
      return Math.cos(angle) * scale(d);  // Animate growth outward in a clockwise direction
    })
    .attr("y2", (d, i) => {
      const angle = i * angleStep;  // Only clockwise animation
      return Math.sin(angle) * scale(d);  // Animate growth outward in a clockwise direction
    });  // Animate growth outward
}).catch(function(error) {
  console.log("Error loading the CSV file:", error);
});
