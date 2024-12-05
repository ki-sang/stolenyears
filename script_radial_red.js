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
const minRadius = maxRadius * 0.25; // Adjust this ratio for the size of the void

// Scale for thresholds
const scale = d3.scaleLinear()
  .domain([0, 18]) // Adjusted domain for 0 to 18 years
  .range([minRadius, maxRadius]);

const positions = {
  zero: { x: centerX, y: centerY }, // Center (0 years)
  eighteen: { x: centerX + scale(18), y: centerY }, // 18 years
};

// Add counters to the SVG
const peopleCounter = svg.append("text")
  .attr("x", centerX - 1000)
  .attr("y", centerY)
  .attr("fill", "grey")
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .text("0");

const yearsCounter = svg.append("text")
  .attr("x", centerX + 1000)
  .attr("y", centerY)
  .attr("fill", "grey")
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .text("0");

// Add labels below the counters
svg.append("text")
  .attr("x", centerX - 1000)
  .attr("y", centerY + 25)
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .text("Child Martyrs");

svg.append("text")
  .attr("x", centerX + 1000)
  .attr("y", centerY + 25)
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
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
    .style("opacity", 0);

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

// Function to animate the "18 years" dot and display the data
function animateEighteenDot() {
  svg.append("circle")
    .attr("cx", positions.eighteen.x)
    .attr("cy", positions.eighteen.y)
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
    .style("opacity", 0)
    .text("Placeholder text...");

  placeholder.transition()
    .duration(2000) // Fade-in duration
    .style("opacity", 1)
    .transition()
    .delay(2000) // Time for reading
    .duration(2000) // Fade-out duration
    .style("opacity", 0)
    .on("end", () => {
      placeholder.remove(); // Remove the placeholder after it fades out
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

    // Filter to include only individuals 18 years old or younger
    data = data
      .filter(d => !isNaN(d.age) && +d.age >= 0 && +d.age <= 18)
      .map((d, i) => ({
        ...d,
        age: Math.max(+d.age, 1),
        stolenYears: 75 - Math.max(+d.age, 1), // Stolen years calculated as 75 - age
        angle: (i % 360) * (Math.PI / 180) + Math.floor(i / 360) * 0.02, // Angle based on index
        name_en: d.en_name || "Unknown", // English name
        name_ar: d.name || "غير معروف", // Arabic name
      }))
      .sort((a, b) => b.age - a.age);

    const pointsPerLap = 540;
    const angleStep = 4 * Math.PI / pointsPerLap;
    const angleOffsetPerLap = 0.02;

    const outwardDuration = 30;
    const radialDelay = 25;

    // Function to get progressive color based on frame
    function getProgressiveColor(frame) {
      const lapIndex = Math.floor(frame / pointsPerLap);
      const totalLaps = Math.ceil(data.length / pointsPerLap);
      const t = lapIndex / totalLaps;

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
    function animateLine(d, angle, frame, currentOutwardDuration) {
      return new Promise((resolve) => {
        // Adjust target coordinates to start from the offset circle
        const startX = Math.cos(angle) * minRadius;
        const startY = Math.sin(angle) * minRadius;
        const targetX = Math.cos(angle) * scale(d.age);
        const targetY = Math.sin(angle) * scale(d.age);

        let progress = 0;

        function drawLine() {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(
            startX + (targetX - startX) * progress,
            startY + (targetY - startY) * progress
          );
          ctx.strokeStyle = getProgressiveColor(frame);
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.1; // Adjust opacity for visibility
          ctx.stroke();

          if (progress < 1) {
            progress += 1 / currentOutwardDuration;
            requestAnimationFrame(drawLine);
          } else {
            if (frame === 0) {
              animateEighteenDot();
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
            tooltip.html(`${d.name_en}, ${d.name_ar}, ${d.age}`)
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
        .text(`${d.name_en}, killed at ${d.age} years old.`);

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

      // Animate the first line
      if (frame < data.length) {
        const d = data[frame];
        const lapIndex = Math.floor(frame / pointsPerLap);
        const baseAngle = (frame % pointsPerLap) * angleStep;
        const adjustedAngle = baseAngle + lapIndex * angleOffsetPerLap;

        // Adjust durations for the first line
        let currentOutwardDuration = outwardDuration;
        const delayMultipliers = [10]; // Slowing factor for the first line
        currentOutwardDuration *= delayMultipliers[0];

        await animateLine(d, adjustedAngle, frame, currentOutwardDuration);

        totalPeople++;
        totalStolenYears += d.stolenYears;

        updateCounters();

        frame++;
      }

      // For the next 4 frames (lines), animate lines sequentially
      while (frame < 5 && frame < data.length) {
        const d = data[frame];
        const lapIndex = Math.floor(frame / pointsPerLap);
        const baseAngle = (frame % pointsPerLap) * angleStep;
        const adjustedAngle = baseAngle + lapIndex * angleOffsetPerLap;

        // Adjust durations for frames 1 to 4 (second to fifth lines)
        let currentOutwardDuration = outwardDuration;
        const delayMultipliers = [8, 6, 4, 2]; // Slowing factors
        currentOutwardDuration *= delayMultipliers[frame - 1];

        await animateLine(d, adjustedAngle, frame, currentOutwardDuration);

        totalPeople++;
        totalStolenYears += d.stolenYears;

        updateCounters();

        frame++;
      }

      // Animate the rest of the lines concurrently
      function animateRest() {
        if (frame >= data.length) return;

        const d = data[frame];
        const lapIndex = Math.floor(frame / pointsPerLap);
        const baseAngle = (frame % pointsPerLap) * angleStep;
        const adjustedAngle = baseAngle + lapIndex * angleOffsetPerLap;

        let currentOutwardDuration = outwardDuration;
        let currentRadialDelay = radialDelay;

        animateLine(d, adjustedAngle, frame, currentOutwardDuration);

        totalPeople++;
        totalStolenYears += d.stolenYears;

        if (frame % 10 === 0) {
          updateCounters();
        }

        frame++;
        setTimeout(animateRest, currentRadialDelay);
      }

      animateRest();
    }

    animate(); // Start radial animation
  });
}

// Start the visualization
showPlaceholder();
