// Select the SVG canvas and set it to full screen
const width = window.innerWidth;  // Full width of the window
const height = window.innerHeight;  // Full height of the window

const svg = d3.select("#svgCanvas")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "black") // Set the background to black
  .append("g")
  // .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  // var namesData = d3.json("names_en.json")

// Read the CSV and extract the data
d3.csv("names_test.csv").then(function(data) {

  // Initialize floating stars
  floatStars(data);

/**
 * Function to create floating stars
 * @param {Array} values - Array of star names
 */
  function floatStars(values) {
  // Function to create a single star
  function createStar(value) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = JSON.stringify(value).replace('{"name_en":"', '').replace('"}', '');

    // Set a random horizontal position within the viewport
    star.style.left = Math.random() * window.innerWidth + 'px';
    // Set a random vertical position within the viewport (static position, no scrolling)
    star.style.top = Math.random() * window.innerHeight + 'px';
    // Apply the "bobbing" animation
    star.style.animationName = 'twinkling';
    star.style.animationDuration = (Math.random() * 4 + 5) + 's'; // Random duration between 5s and 9s
    star.style.animationTimingFunction = 'ease-in-out'; // Smooth bounce
    star.style.animationIterationCount = 'infinite'; // Repeat forever

    // Optionally, set a random size
    star.style.fontSize = (Math.random() * 5 + 5) + 'px';

    // Append the star to the body
    document.body.appendChild(star);

    // Remove the star after the animation ends
    star.addEventListener('animationend', () => {
      star.remove();
    });
  }

  // Create initial stars
  values.forEach(value => {
    createStar(value);
  });

  // Continuously create stars at intervals
  setInterval(() => {
    const randomValue = values[Math.floor(Math.random() * values.length)];
    createStar(randomValue);
  }, 500); // Add a new star every 500ms
}
});
