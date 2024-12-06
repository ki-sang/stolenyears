// Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fadeOverlay = document.getElementById("fadeOverlay");

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Center canvas
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Translate the context to the center
ctx.translate(centerX, centerY);

// Define maximum radius
const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;

// Set up the SVG for static elements
const svg = d3.select("#svgCanvas")
  .attr("width", canvas.width)
  .attr("height", canvas.height);

// Define minimum radius for the void in the center
const minRadius = maxRadius * 0.1; // Adjust this ratio for the size of the void

// Adjusted scale for line lengths
const scale = d3.scaleLinear()
  .domain([0, 17]) // Ages from 0 to 17
  .range([0, maxRadius - minRadius]); // Line lengths from 0 to (maxRadius - minRadius)

const positions = {
  zero: { x: centerX, y: centerY }, // Center (0 years)
  seventeen: { x: centerX + maxRadius, y: centerY }, // 17 years
};

// Add counters to the SVG
const peopleCounter = svg.append("text")
  .attr("x", centerX - (window.innerWidth * 0.35)) //formerly - 1000
  .attr("y", centerY + (window.innerHeight * 0.33)) //formerly no transformation
  .attr("fill", "grey")
  .attr("font-size", "30px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("0");

  const yearsCounter = svg.append("text")
  .attr("x", centerX + (window.innerWidth * 0.35)) //formerly + 1000
  .attr("y", centerY + (window.innerHeight * 0.33)) //formerly no transformation
  .attr("fill", "grey")
  .attr("font-size", "30px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("0");

// Add labels below the counters
svg.append("text")
  .attr("x", centerX - (window.innerWidth * 0.35))
  .attr("y", centerY + (window.innerHeight * 0.27)) //formerly + 25
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("child martyrs");

svg.append("text")
  .attr("x", centerX + (window.innerWidth * 0.35))
  .attr("y", centerY + (window.innerHeight * 0.27)) //formerly + 25
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("stolen years");

// Initialize counters
let totalPeople = 0;
let totalStolenYears = 0;
let displayPeople = 0;
let displayYears = 0;

// Add the zero dot
function animateDots() {
  const zeroDot = svg.append("circle")
    .attr("cx", positions.zero.x + 32)
    .attr("cy", positions.zero.y)
    .attr("r", 2)
    .attr("fill", "white")
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .on("start", function () {
      // Start the first line animation
      showCounters(); // Show counters
      startRadialAnimation(); // Start radial animation
    })
    .transition()
    .duration(2000)
    .delay(2000)
    .style("opacity", 0)
    .style("font-family", "'Overused Grotesk', sans-serif");

  svg.append("text")
    .attr("x", positions.zero.x + 23)
    .attr("y", positions.zero.y)
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("text-anchor", "start")
    .text("0")
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .transition()
    .duration(2000)
    .delay(2000)
    .style("opacity", 0);
}

// Function to animate the "17 years" dot and display the data
function animateSeventeenDot() {
  svg.append("circle")
    .attr("cx", positions.seventeen.x)
    .attr("cy", positions.seventeen.y)
    .attr("r", 2)
    .attr("fill", "darkred")
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .transition()
    .duration(2000)
    .delay(2000)
    .style("opacity", 0);
}

// Function to smoothly update the counters
function updateCounters() {
  displayPeople += (totalPeople - displayPeople) * 0.1;
  displayYears += (totalStolenYears - displayYears) * 0.1;

  peopleCounter.text(Math.floor(displayPeople).toLocaleString());
  yearsCounter.text(Math.floor(displayYears).toLocaleString());

  if (Math.abs(totalPeople - displayPeople) > 0.5 || Math.abs(totalStolenYears - displayYears) > 0.5) {
    requestAnimationFrame(updateCounters);
  }
}

function showCounters() {
  peopleCounter.transition().duration(500).attr("opacity", 1);
  yearsCounter.transition().duration(500).attr("opacity", 1);

  svg.selectAll("text")
    .filter(function () {
      return d3.select(this).text() === "child martyrs" || d3.select(this).text() === "stolen years";
    })
    .transition().duration(500).attr("opacity", 1);
}

// Add Placeholder Text
function showPlaceholder() {
  const placeholder = svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY - 50) // Slightly above center
    .attr("fill", "white")
    .attr("font-size", "24px")
    .attr("text-anchor", "middle")
    .style("font-family", "'Overused Grotesk', sans-serif")
    .style("opacity", 0)
    .text("stolen years");

  placeholder.transition()
    .duration(2000) // Fade-in duration
    .style("opacity", 1)
    .transition()
    .delay(2000) // Time for reading
    .duration(2000) // Fade-out duration
    .style("opacity", 0)
    .on("end", () => {
      placeholder.remove(); // Remove the placeholder after it fades out
      setTimeout(showPlaceholder1, 500); // Trigger placeholder1 after delay
    });
}

function showPlaceholder1() {
  const placeholder1 = svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY - 50) // Slightly above center
    .attr("fill", "white")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .style("font-family", "'Overused Grotesk', sans-serif")
    .style("opacity", 0)
  
  const lines1 = [
    "since october 7, 2023 over 45,000 Palestinians have been directly killed",
    "by us-funded israeli military attacks in Gaza.",
    " ",
    " ",
    " ",
    "as of october 29, 2024 this includes 11,354 Palestinian children whose",
    "deaths have been officially registered by health authorities."
  ];

  lines1.forEach((line1, i) => {
    placeholder1.append("tspan")
      .attr("x", centerX) // Keep the same x-coordinate
      .attr("dy", i === 0 ? 0 : "1.4em") // Vertical spacing
      .text(line1);
  });

  placeholder1.transition()
    .duration(2000) // Fade-in duration
    .style("opacity", 1)
    .transition()
    .delay(7500) // Time for reading
    .duration(2000) // Fade-out duration
    .style("opacity", 0)
    .on("end", () => {
      placeholder1.remove(); // Remove the placeholder after it fades out
      setTimeout(showPlaceholder2, 500); // Trigger placeholder2
    });
}

function showPlaceholder2() {
  // Create a text element for the initial lines (excluding the final phrase)
  const initialPlaceholder = svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY - 50) // Slightly above center
    .attr("fill", "white")
    .attr("font-size", "14px") // Maintain original font size
    .attr("text-anchor", "middle")
    .style("font-family", "'Overused Grotesk', sans-serif")
    .style("opacity", 0);
  
  const initialLines2 = [
    "despite having a normal life expectancy of 75 years, each of",
    "these children were martyred before turning 18 years old.",
    " ",
    " "
  ];

  // Append each initial line as a tspan
  initialLines2.forEach((line2, i) => {
    initialPlaceholder.append("tspan")
      .attr("x", centerX) // Keep the same x-coordinate
      .attr("dy", i === 0 ? 0 : "1.4em") // Vertical spacing
      .text(line2);
  });

  // Fade in the initial lines
  initialPlaceholder.transition()
    .duration(2000) // Fade-in duration
    .style("opacity", 1)
    .on("end", () => {
      // After a delay (e.g., 5 seconds), introduce the final phrase
      setTimeout(() => {
        // Create a separate text element for the final phrase
        const finalPlaceholder = svg.append("text")
          .attr("x", centerX)
          .attr("y", centerY - 50 + initialLines2.length * 1.4 * 16) // Position below the last initial line
          .attr("fill", "white")
          .attr("font-size", "14px") // Same font size
          .attr("text-anchor", "middle")
          .style("font-family", "'Overused Grotesk', sans-serif")
          .style("opacity", 0)
          .text("these are their stolen years.");

        // Fade in the final phrase
        finalPlaceholder.transition()
          .duration(1000) // Fade-in duration for the final phrase
          .style("opacity", 1)
          .on("end", () => {
            // Fade out the initial lines
            initialPlaceholder.transition()
              .duration(2000) // Fade-out duration
              .style("opacity", 0)
              .remove(); // Remove the initial lines after fading out

            // Keep the final phrase visible for a certain duration before fading out
            finalPlaceholder.transition()
              .delay(5000) // Time to keep the final phrase visible
              .duration(2000) // Fade-out duration
              .style("opacity", 0)
              .on("end", () => {
                finalPlaceholder.remove(); // Remove the final phrase after fading out
                animateDots(); // Trigger the dots animation
              });
          });
      }, 5000); // Initial delay before introducing the final phrase (adjust as needed)
    });
}

// Create a global tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "name-popup")
  .style("position", "absolute")
  .style("color", "white")
  .style("font-size", "8px")
  .style("font-family", "'Overused Grotesk', sans-serif")
  .style("background", "#161616") // Dark gray background
  .style("padding", "5px 10px")
  .style("border-radius", "2px")
  .style("pointer-events", "none") // Prevent blocking interactions
  .style("opacity", 0)
  .style("z-index", 1000); // Ensure popup is above all other elements

function startRadialAnimation() {
  d3.csv("killed-in-gaza.csv").then(function (data) {

    // Filter to include only individuals 17 years old or younger
    data = data
      .filter(d => !isNaN(d.age) && +d.age >= 0 && +d.age <= 17)
      .map((d, i) => {
        let age = +d.age;
        if (age === 0) {
          // Assign a fixed value of 0.5 to ages of 0
          age = 0.5; // Fixed value for children under 1 year old
        }
        return {
          ...d,
          age: age,
          stolenYears: 75 - age, // Stolen years calculated as 75 - age
          name_en: d.en_name || "Unknown", // English name
          name_ar: d.name || "غير معروف", // Arabic name
        };
      })
      .sort((a, b) => b.age - a.age);

    const totalDataPoints = data.length;

    // Introduce the desired angular range
    const desiredAngularRange = Math.PI * 30; // Adjust as needed

    // Calculate the angle step based on the desired angular range
    const angleStep = desiredAngularRange / totalDataPoints;

    const outwardDuration = 10; // Adjust as needed for speed
    const radialDelay = 10;     // Adjust as needed for speed

    // Function to get progressive color based on frame
    function getProgressiveColor(frame) {
      const t = frame / totalDataPoints;

      if (t < 0.25) {
        return d3.interpolateRgb("#440507", "#84252f")(t / 0.25);
      } else if (t < 0.5) {
        return d3.interpolateRgb("#84252f", "#a03339")((t - 0.25) / 0.25);
      } else if (t < 0.75) {
        return d3.interpolateRgb("#a03339", "#dc5e58")((t - 0.5) / 0.25);
      } else {
        return d3.interpolateRgb("#dc5e58", "#fb9989")((t - 0.75) / 0.25);
      }
    }

    // Function to animate each line
    function animateLine(d, frame, currentOutwardDuration) {
      return new Promise((resolve) => {
        // Calculate the angle for this line
        const angle = frame * angleStep;

        // Adjust target coordinates with corrected scaling
        const startX = Math.cos(angle) * minRadius;
        const startY = Math.sin(angle) * minRadius;
        const targetRadius = minRadius + scale(d.age);
        const targetX = Math.cos(angle) * targetRadius;
        const targetY = Math.sin(angle) * targetRadius;

        let progress = 0;

        function drawLine() {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(
            startX + (targetX - startX) * progress,
            startY + (targetY - startY) * progress
          );
          ctx.strokeStyle = getProgressiveColor(frame);
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.1; // Adjust opacity for visibility
          ctx.stroke();

          if (progress < 1) {
            progress += 1 / currentOutwardDuration;
            requestAnimationFrame(drawLine);
          } else {
            if (frame === 0) {
              animateSeventeenDot();
              showDataPointText(d, angle, targetX, targetY, frame);
            } else if (frame > 0 && frame < 5) {
              showDataPointText(d, angle, targetX, targetY, frame);
            }
            resolve();
          }
        }

        drawLine();

        // Add mouseover and mouseout triggers
        const line = svg.append("line")
          .attr("x1", centerX + startX)
          .attr("y1", centerY + startY)
          .attr("x2", centerX + targetX)
          .attr("y2", centerY + targetY)
          .style("stroke", "transparent")
          .style("stroke-width", "10px")
          .on("mouseover", function (event) {
            tooltip.html(`${d.name} ${d.name_en}, ${Math.round(d.age)} years old`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px")
              .transition()
              .duration(200)
              .style("opacity", 1);
          })
          .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px");
          })
          .on("mouseout", function () {
            tooltip.transition()
              .duration(200)
              .style("opacity", 0);
          });
      });
    }

    // Function to display text for data points (frames 0 to 4)
    function showDataPointText(d, angle, targetX, targetY, frame) {
      const offset = 10; // Existing offset along the line's direction
      const baseOffsetX = 20; // Adjust this value to move text further right
      const angleInDegrees = (angle * 180) / Math.PI % 360;

      let additionalOffsetX = baseOffsetX;
      let textAnchor = "start";
      if (angleInDegrees > 90 && angleInDegrees < 270) {
        additionalOffsetX = -baseOffsetX;
        textAnchor = "end";
      }

      const textX = centerX + targetX + Math.cos(angle) * offset + additionalOffsetX;
      const textY = centerY + targetY + Math.sin(angle) * offset;

      const dataPointText = svg.append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("fill", "darkred")
        .attr("font-size", "8px")
        .style("font-family", "'Overused Grotesk', sans-serif")
        .attr("text-anchor", textAnchor)
        .attr("opacity", 0)
        .text(`${d.name_en}, killed at ${Math.round(d.age)} years old.`);

      // Set different durations based on the frame
      let fadeInDuration = 2000;
      let visibleDuration = 2000;
      let fadeOutDuration = 2000;

      if (frame > 0) {
        fadeInDuration = 1000; // Faster fade-in
        visibleDuration = 1000; // Shorter visibility
        fadeOutDuration = 1000; // Faster fade-out
      }

      dataPointText.transition()
        .duration(fadeInDuration)
        .attr("opacity", 1)
        .transition()
        .delay(visibleDuration)
        .duration(fadeOutDuration)
        .attr("opacity", 0)
        .on("end", () => {
          dataPointText.remove();
        });
    }

    async function animate() {
      let frame = 0;

      const delayMultipliers = [20, 16, 12, 10, 8]; // Slowing factors for the initial lines

      // Animate the first few lines sequentially
      while (frame < 5 && frame < data.length) {
        const d = data[frame];

        // Adjust durations for frames 0 to 4 (first five lines)
        let currentOutwardDuration = outwardDuration * delayMultipliers[frame];

        // Increment totalPeople before the animation
        totalPeople++;
        updateCounters();

        await animateLine(d, frame, currentOutwardDuration);

        // Increment totalStolenYears after the animation
        totalStolenYears += d.stolenYears;
        updateCounters();

        frame++;
      }

      // Animate the rest of the lines concurrently
      function animateRest() {
        if (frame >= data.length) return;

        const d = data[frame];

        // Increment totalPeople before the animation
        totalPeople++;
        

        function fadeToBlack() {
          fadeOverlay.style.opacity = "1"; // Gradually make the overlay opaque
          fadeOverlay.addEventListener("transitionend", () => {
            fadeOverlay.remove();
            canvas.remove(); // Remove the canvas after the fade-out
            svg.remove();
          });
          setTimeout(triggerNextFunction, 2500);
        }

        if (totalPeople >= 11354) {
          setTimeout(fadeToBlack, 4000)
        }

        animateLine(d, frame, outwardDuration);

        // Increment totalStolenYears after the animation
        totalStolenYears += d.stolenYears;

        // Update counters every 10 frames
        if (frame % 10 === 0) {
          updateCounters();
        }

        frame++;
        setTimeout(animateRest, radialDelay);
      }

      animateRest();
    }

    animate();
  
    // Start radial animation
  });
  
}

// Start the visualization
showPlaceholder();

// Define the next function to trigger
function triggerNextFunction() {

  // Get the canvas and context
  const canvas2 = document.getElementById("canvas2");
  const ctx2 = canvas2.getContext("2d");

  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  // Center canvas
  const centerX = canvas2.width / 2;
  const centerY = canvas2.height / 2;

  // Translate the context to the center
  ctx2.translate(centerX, centerY);

  const svg2 = d3.select("#svgCanvas2")
    .attr("width", canvas2.width)
    .attr("height", canvas2.height)

  // Add transition text
  function showTransition() {
    const transText = svg2.append("text")
      .attr("x", centerX)
      .attr("y", centerY - 50) // Slightly above center
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .style("font-family", "'Overused Grotesk', sans-serif")
      .style("opacity", 0)
    
    const transLines = [
      "11,354 children",
      " ",
      "752,401 stolen years"
    ];
  
    transLines.forEach((transLines, i) => {
      transText.append("tspan")
        .attr("x", centerX) // Keep the same x-coordinate
        .attr("dy", i === 0 ? 0 : "1.4em") // Vertical spacing
        .text(transLines);
    });
  
    transText.transition()
      .duration(2000) // Fade-in duration
      .style("opacity", 1)
      .transition()
      .delay(4500) // Time for reading
      .duration(2000) // Fade-out duration
      .style("opacity", 0)
      .on("end", () => {
        transText.remove(); // Remove the placeholder after it fades out
        setTimeout(showTransition2, 500); // Trigger placeholder2
      });
  }

  function showTransition2() {
    const transText2 = svg2.append("text") // EDITED FROM svg2 TO svg
      .attr("x", centerX)
      .attr("y", centerY - 50) // Slightly above center
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .style("font-family", "'Overused Grotesk', sans-serif")
      .style("opacity", 0)
      .text("here are their names");
    
      transText2.transition()
      .duration(2000) // Fade-in duration
      .style("opacity", 1)
      .transition()
      .delay(2000) // Time for reading
      .duration(2000) // Fade-out duration
      .style("opacity", 0)
      .on("end", () => {
        transText2.remove(); // Remove the transText2 after it fades out
        //setTimeout(animateNames()); // Trigger names after delay
        animateNames();
      });
  }

  function animateNames() {

    d3.csv("names_children.csv").then(function(data2) {

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
      floatStars(data2);

    });

  }

showTransition();

}
