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

// Scale for thresholds
const scale = d3.scaleLinear()
  .domain([0, 18]) // Adjusted domain for 0 to 18 years
  .range([0, maxRadius]);

const positions = {
  zero: { x: centerX, y: centerY }, // Center (0 years)
  eighteen: { x: centerX + scale(18), y: centerY }, // 18 years
};

// Add the dots
const dots = [
  { x: positions.zero.x, y: positions.zero.y, label: "0", id: "zero" },
  { x: positions.eighteen.x, y: positions.eighteen.y, label: "18 years", id: "eighteen" },
];

dots.forEach((dot) => {
  svg.append("circle")
    .attr("cx", dot.x)
    .attr("cy", dot.y)
    .attr("r", 2)
    .attr("fill", "white")
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .transition()
    .duration(2000)
    .delay(2000)
    .style("opacity", 0);

  svg.append("text")
    .attr("x", dot.x + 10)
    .attr("y", dot.y)
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("text-anchor", "start")
    .text(dot.label)
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .transition()
    .duration(2000)
    .delay(2000)
    .style("opacity", 0);
});

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
  .attr("y", centerY + 50)
  .attr("fill", "gray")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("opacity", 0)
  .text("Child Martyrs");

svg.append("text")
  .attr("x", centerX + 1000)
  .attr("y", centerY + 50)
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

function showCounters() {
  peopleCounter.transition().duration(500).attr("opacity", 1);
  yearsCounter.transition().duration(500).attr("opacity", 1);

  svg.selectAll("text")
    .filter(function () {
      return d3.select(this).text() === "Child Martyrs" || d3.select(this).text() === "Stolen Years";
    })
    .transition().duration(500).attr("opacity", 1);
}

function startRadialAnimation() {
  // Radial animation logic here...
}

// Trigger radial animation after dots fade out
setTimeout(() => {
  showCounters(); // Show counters
  setTimeout(() => {
    startRadialAnimation(); // Trigger radial animation
  }, 2000); // Start radial animation 2 seconds after counters appear
}, 4000); // Show counters 4 seconds after dots fade out

function startRadialAnimation() {
  d3.csv("killed-in-gaza.csv").then(function (data) {
    // Filter to include only individuals 18 years old or younger
    data = data
      .filter(d => !isNaN(d.age) && +d.age >= 0 && +d.age <= 18)
      .map((d, i) => ({
        ...d,
        age: Math.max(+d.age, 1),
        stolenYears: 75 - Math.max(+d.age, 1), // Stolen years calculated as 75 - age
        angle: (i % 360) * (Math.PI / 180) + Math.floor(i / 360) * 0.01
      }))
      .sort((a, b) => b.age - a.age);

    const pointsPerLap = 540;
    const angleStep = 4 * Math.PI / pointsPerLap;
    const angleOffsetPerLap = 0.01;

    const outwardDuration = 30;
    const totalRuntime = 10000;
    const radialDelay = totalRuntime / data.length;

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

    function animateLine(d, angle, frame) {
      const targetX = Math.cos(angle) * scale(d.age);
      const targetY = Math.sin(angle) * scale(d.age);
      let progress = 0;

      function drawLine() {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(targetX * progress, targetY * progress);
        ctx.strokeStyle = getProgressiveColor(frame);
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.05;
        ctx.stroke();

        if (progress < 1) {
          progress += 1 / outwardDuration;
          requestAnimationFrame(drawLine);
        }
      }

      drawLine();
    }

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
      setTimeout(animate, radialDelay);
    }

    animate();
  });
}
