// font


// Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
const minRadius = maxRadius * 0.15; // Adjust this ratio for the size of the void

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
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("0");

const yearsCounter = svg.append("text")
  .attr("x", centerX + (window.innerWidth * 0.35)) //formerly + 1000
  .attr("y", centerY + (window.innerHeight * 0.33)) //formerly no transformation
  .attr("fill", "grey")
  .attr("font-size", "40px")
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
  .text("Child Martyrs");

svg.append("text")
  .attr("x", centerX + (window.innerWidth * 0.35))
  .attr("y", centerY + (window.innerHeight * 0.27)) //formerly + 25
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .style("font-family", "'Overused Grotesk', sans-serif")
  .text("Stolen Years");

// Initialize counters
let totalPeople = 0;
let totalStolenYears = 0;
let displayPeople = 0;
let displayYears = 0;

// Add the zero dot
function animateDots() {
  const zeroDot = svg.append("circle")
    .attr("cx", positions.zero.x + 140)
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
    .attr("x", positions.zero.x + 120)
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
      return d3.select(this).text() === "Child Martyrs" || d3.select(this).text() === "Stolen Years";
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
      // animateDots(); // Trigger the dots animation
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
    "Since October 7, 2023 over 45,000 Palestinians have been directly killed",
    "by US-funded Israeli military attacks in Gaza.",
    " ",
    " ",
    "45,000.",
    " ",
    " ",
    "As of October 29, 2024 this includes more than 11,350 Palestinian children",
    "whose deaths have been officially registered by health authorities."
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
    .delay(10000) // Time for reading
    .duration(2000) // Fade-out duration
    .style("opacity", 0)
    .on("end", () => {
      placeholder1.remove(); // Remove the placeholder after it fades out
      setTimeout(showPlaceholder2, 1000); // Trigger placeholder2
    });
}

function showPlaceholder2() {
  const placeholder2 = svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY - 50) // Slightly above center
    .attr("fill", "white")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .style("font-family", "'Overused Grotesk', sans-serif")
    .style("opacity", 0)

  const lines2 = [
    "With a normal life expectancy of 75 years, these children were martyred",
    "before reaching 18-years-old.",
    " ",
    " ",
    "The attacks against Palestine have stolen a total of",
    "673,488 years from child martyrs in Gaza."
  ];
  
  lines2.forEach((line2, i) => {
    placeholder2.append("tspan")
      .attr("x", centerX) // Keep the same x-coordinate
      .attr("dy", i === 0 ? 0 : "1.4em") // Vertical spacing
      .text(line2);
  });
  
  placeholder2.transition()
    .duration(2000) // Fade-in duration
    .style("opacity", 1)
    .transition()
    .delay(8000) // Time for reading
    .duration(2000) // Fade-out duration
    .style("opacity", 0)
    .on("end", () => {
      placeholder2.remove(); // Remove the placeholder after it fades out
      animateDots(); // Trigger the dots animation
    });
}

// Create a global tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "name-popup")
  .style("position", "absolute")
  .style("color", "white")
  .style("font-size", "12px")
  .style("background", "#161616") // Dark gray background
  .style("padding", "5px 10px")
  .style("border-radius", "4px")
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

    const outwardDuration = 30; // Adjust as needed for speed
    const radialDelay = 30;     // Adjust as needed for speed

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
            tooltip.html(`${d.name_en}, ${d.name_ar}, ${d.age.toFixed(1)} years old`)
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
        .attr("font-size", "12px")
        .attr("text-anchor", textAnchor)
        .attr("opacity", 0)
        .text(`${d.name_en}, killed at ${d.age.toFixed(1)} years old.`);

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

      const delayMultipliers = [10, 8, 6, 4, 2]; // Slowing factors for the initial lines

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

