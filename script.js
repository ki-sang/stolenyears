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

// Define maximum radius with 20% increase
const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;

// Set up the SVG for static elements
const svg = d3.select("#svgCanvas")
  .attr("width", canvas.width)
  .attr("height", canvas.height);

// Animate adulthood circle
const scale = d3.scaleLinear()
  .domain([0, 18]) // Updated domain for adulthood threshold
  .range([0, maxRadius]);

const scaledRadius = scale(18);
const circumference = 2 * Math.PI * scaledRadius;

// Add adulthood threshold circle to the SVG
const adulthoodCircle = svg.append("circle")
  .attr("cx", centerX)
  .attr("cy", centerY)
  .attr("r", scaledRadius)
  .attr("stroke", "white")
  .attr("stroke-width", 0.25)
  .attr("fill", "none")
  .attr("stroke-dasharray", circumference)
  .attr("stroke-dashoffset", circumference);

// Add label for adulthood threshold
const adulthoodText = svg.append("text")
  .attr("x", centerX)
  .attr("y", centerY - scaledRadius - 20)
  .attr("fill", "white")
  .attr("font-size", "16px")
  .attr("text-anchor", "middle")
  .text("18 years Adulthood");

// Animate the circle
adulthoodCircle.transition()
  .duration(3000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0)
  .on("end", () => {
    adulthoodCircle.transition().duration(1000).attr("opacity", 0);
    adulthoodText.transition().duration(1000).attr("opacity", 0);
    showCounters(); // Show counters after the circle animation
  });

// Add counters to the SVG
const peopleCounter = svg.append("text")
  .attr("x", centerX - 1000)
  .attr("y", centerY)
  .attr("fill", "grey")
  .attr("font-size", "40px")
  .attr("font-family", "Verdana, serif")
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
  .attr("y", centerY + 50)
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .text("Child Martyrs");

svg.append("text")
  .attr("x", centerX + 1000)
  .attr("y", centerY + 50)
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("font-family", "Verdana, serif")
  .attr("text-anchor", "middle")
  .text("Stolen Years");

// Initialize counters
let totalPeople = 0;
let totalStolenYears = 0;
let displayPeople = 0;
let displayYears = 0;

// Function to smoothly update the counters
function updateCounters() {
  displayPeople += (totalPeople - displayPeople) * 0.1;
  displayYears += (totalStolenYears - displayYears) * 0.1;

  peopleCounter.text(Math.floor(displayPeople));
  yearsCounter.text(Math.floor(displayYears));

  if (Math.abs(totalPeople - displayPeople) > 0.5 || Math.abs(totalStolenYears - displayYears) > 0.5) {
    requestAnimationFrame(updateCounters);
  }
}

// Show counters
function showCounters() {
  peopleCounter.transition().duration(500).attr("opacity", 1);
  yearsCounter.transition().duration(500).attr("opacity", 1);
}

// Load and process data
d3.csv("killed-in-gaza.csv").then(function (data) {
  // Filter to include only individuals 18 years old or younger
  data = data
    .filter(d => !isNaN(d.age) && +d.age >= 0 && +d.age <= 18)
    .map((d, i) => ({
      ...d,
      age: d.age === "0" ? Math.random() * 0.8 + 0.1 : Math.max(+d.age, 1), // Assign random value between 0.1 and 0.9 for age 0
      stolenYears: Math.max(0, 18 - (d.age === "0" ? Math.random() * 0.8 + 0.1 : +d.age)),
      angle: (i % 360) * (Math.PI / 180) + Math.floor(i / 360) * 0.01 // Spiral distribution
    }))
    
    .sort((a, b) => b.age - a.age); // Sort by age (oldest to youngest)

  const pointsPerLap = 540; // Number of points per full lap
  const angleStep = 4 * Math.PI / pointsPerLap; // Angular spacing per point
  const angleOffsetPerLap = 0.01; // Slight offset for each lap

  // Adjustable parameters
  const outwardDuration = 30; // Frames for outward growth

  // Total runtime (in ms)
  const totalRuntime = 1000; // Adjust this for desired total animation time
  const radialDelay = totalRuntime / data.length; // Calculate delay dynamically

  function getProgressiveColor(frame) {
    const lapIndex = Math.floor(frame / pointsPerLap); // Current lap index
    const totalLaps = Math.ceil(data.length / pointsPerLap); // Total number of laps
    const t = lapIndex / totalLaps; // Normalize to [0, 1] range

    if (t < 0.25) {
      // First quarter: 440507 to 84252f
      return d3.interpolateRgb("#440507", "#84252f")(t / 0.25);
    } else if (t < 0.5) {
      // Second quarter: 84252f to a03339
      return d3.interpolateRgb("#84252f", "#a03339")((t - 0.25) / 0.25);
    } else if (t < 0.75) {
      // Third quarter: a03339 to dc5e58
      return d3.interpolateRgb("#a03339", "#dc5e58")((t - 0.5) / 0.25);
    } else {
      // Final quarter: dc5e58 to fb9989
      return d3.interpolateRgb("#dc5e58", "#fb9989")((t - 0.75) / 0.25);
    }
  }

  // Function to animate a single line
  function animateLine(d, angle, frame) {
    const targetX = Math.cos(angle) * scale(d.age);
    const targetY = Math.sin(angle) * scale(d.age);
    let progress = 0;
  
    function drawLine() {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(targetX * progress, targetY * progress);
      ctx.strokeStyle = getProgressiveColor(frame); // Use the updated gradient color
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.05; // Subtle transparency
      ctx.stroke();
  
      if (progress < 1) {
        progress += 1 / outwardDuration; // Smooth outward growth
        requestAnimationFrame(drawLine);
      }
    }
  
    drawLine();
  }
  

  // Animation loop
  let frame = 0;
  function animate() {
    if (frame >= data.length) return;

    const d = data[frame];
    const lapIndex = Math.floor(frame / pointsPerLap);
    const baseAngle = (frame % pointsPerLap) * angleStep;
    const adjustedAngle = baseAngle + lapIndex * angleOffsetPerLap;

    animateLine(d, adjustedAngle, frame);

    totalPeople++;
    totalStolenYears += d.stolenYears;

    if (frame % 10 === 0) {
      updateCounters();
    }

    frame++;
    setTimeout(animate, radialDelay); // Use dynamically calculated delay
  }

  animate();
});
