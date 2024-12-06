// Select the SVG canvas and set it to full screen
const width = window.innerWidth;  // Full width of the window
const height = window.innerHeight;  // Full height of the window

//----------------------------------------------------------------------
//----------------------------------------------------------------------
//------------------- Commented code meant to add ----------------------
//------------------- text elements before names -----------------------
//------------------- animation. Idea is to let the --------------------
//------------------- text elements finish before ----------------------
//------------------- removing the svg element because -----------------
//------------------- names are applied directly onto ------------------
//------------------- the page, without svg boundaries. ----------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------

// const svg = d3.select("#svgCanvas")
//   .attr("width", width)
//   .attr("height", height)
//   .style("background-color", "black") // Set the background to black
//   .append("g")
//   // .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
//   // var namesData = d3.json("names_en.json")

// function showTransition() {
//   const transText = svg.append("text")
//     .attr("x", centerX)
//     .attr("y", centerY - 50) // Slightly above center
//     .attr("fill", "white")
//     .attr("font-size", "24px")
//     .attr("text-anchor", "middle")
//     .style("font-family", "'Overused Grotesk', sans-serif")
//     .style("opacity", 0)
//     .text("11,355 children",
//       " ",
//       "673,488 stolen years",
//     );
  
//     transText.transition()
//     .duration(2000) // Fade-in duration
//     .style("opacity", 1)
//     .transition()
//     .delay(2000) // Time for reading
//     .duration(2000) // Fade-out duration
//     .style("opacity", 0)
//     .on("end", () => {
//       transText.remove(); // Remove the transText after it fades out
//       setTimeout(showTransition2, 1000); // Trigger transText2 after delay
//     });
// }

// function showTransition2() {
//   const transText2 = svg.append("text")
//     .attr("x", centerX)
//     .attr("y", centerY - 50) // Slightly above center
//     .attr("fill", "white")
//     .attr("font-size", "24px")
//     .attr("text-anchor", "middle")
//     .style("font-family", "'Overused Grotesk', sans-serif")
//     .style("opacity", 0)
//     .text("Here are their names");
  
//     transText2.transition()
//     .duration(2000) // Fade-in duration
//     .style("opacity", 1)
//     .transition()
//     .delay(2000) // Time for reading
//     .duration(2000) // Fade-out duration
//     .style("opacity", 0)
//     .on("end", () => {
//       transText2.remove(); // Remove the transText2 after it fades out
//       setTimeout(processWithDelay(values), 500); // Trigger names after delay
//     });
// }

//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------

// Read the CSV and extract the data
d3.csv("names_children.csv").then(function(data) {

/**
 * Function to create floating stars
 * @param {Array} values - Array of star names
 */
  function floatStars(values) {
  // Function to create a single star
  function createStar(value) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = JSON.stringify(value).replace('{"names_en":"', '').replace('"}', '');

    // Set a random horizontal position within the viewport
    star.style.left = Math.random() * window.innerWidth + 'px';
    // Set a random vertical position within the viewport (static position, no scrolling)
    star.style.top = Math.random() * window.innerHeight + 'px';
    // Apply the "bobbing" animation
    star.style.animationName = 'twinkling';
    star.style.animationDuration = (Math.random() * 4 + 5) + 's'; // Random duration between 5s and 9s
    star.style.animationTimingFunction = 'cubic-bezier(.72,.01,.82,.45)';
    star.style.animationIterationCount = 'infinite'; // Repeat forever

    // Optionally, set a random size
    star.style.fontSize = (Math.random() * 5 + 5) + 'px';
    star.style.whiteSpace = 'nowrap';
    star.style.overflow = 'hidden'; // Hide any overflowed text

    // Append the star to the body
    document.body.appendChild(star);

    // Remove the star after the animation ends
    star.addEventListener('animationend', () => {
      star.remove();
    });
  }

// new thing replacing above 51-57 with async functionality
  async function processWithDelay(values) {
    for (const value of values) {
      await new Promise(resolve => {
        setTimeout(() => {
          // Your action with the value, delayed
          createStar(value); 
          resolve(); // Resolve the promise to proceed to the next iteration
        }, 50); // Delay of 1 second (1000ms)
      });
    }
  }
  processWithDelay(values)

  // Continuously create stars at intervals
  setInterval(() => {
    const randomValue = values[Math.floor(Math.random() * values.length)];

    createStar(randomValue);
  }, 1500); // Add a new star every 500ms
}

  // Initialize floating stars
  floatStars(data);

});
