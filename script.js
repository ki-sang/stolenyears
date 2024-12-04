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

// Add the dots
const dots = [
  { x: positions.zero.x, y: positions.zero.y, label: "0", id: "zero" },
  { x: positions.eighteen.x, y: positions.eighteen.y, label: "18 years", id: "eighteen" },
];

function animateDots() {
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

  setTimeout(() => {
    showCounters(); // Show counters after dots
    setTimeout(() => {
      startRadialAnimation(); // Start radial animation
    }, 2000); // Delay before radial animation
  }, 4000); // Delay for dots to finish
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

function startRadialAnimation() {
  d3.csv("killed-in-gaza.csv").then(function (data) {
    // Filter to include only individuals 18 years old or younger
    data = data
      .filter(d => !isNaN(d.age) && +d.age >= 0 && +d.age <= 18)
      .map((d, i) => ({
        ...d,
        age: Math.max(+d.age, 1),
        stolenYears: 75 - Math.max(+d.age, 1), // Stolen years calculated as 75 - age
        angle: (i % 360) * (Math.PI / 180) + Math.floor(i / 360) * 0.01, // Angle based on index
        name_en: d.en_name || "Unknown", // English name
        name_ar: d.name || "غير معروف", // Arabic name
      }))
      .sort((a, b) => b.age - a.age);

    const pointsPerLap = 540;
    const angleStep = 4 * Math.PI / pointsPerLap;
    const angleOffsetPerLap = 0.01;

    const outwardDuration = 30;
    const radialDelay = 50;

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

    function showNameOnMouse(value, event) {
      // Remove any existing name element
      const existingName = document.querySelector(".name-popup");
      if (existingName) existingName.remove();
    
      // Create a new name element
      const nameElement = document.createElement("span");
      nameElement.className = "name-popup";
      nameElement.textContent = `${value.name_en}, ${value.name_ar}, ${value.age}`;
    
      // Style the popup
      nameElement.style.position = "absolute";
      nameElement.style.color = "white";
      nameElement.style.fontSize = "12px";
      nameElement.style.background = "rgba(50, 50, 50, 0.9)"; // Dark gray background
      nameElement.style.padding = "5px 10px";
      nameElement.style.borderRadius = "4px";
      nameElement.style.pointerEvents = "none"; // Prevent blocking interactions
      nameElement.style.transition = "opacity 0.2s ease-in-out";
      nameElement.style.opacity = 0; // Start hidden
      nameElement.style.zIndex = 1000; // Ensure popup is above all other elements
    
      // Append to the body
      document.body.appendChild(nameElement);
    
      // Position near the mouse
      const setPosition = (e) => {
        nameElement.style.left = `${e.pageX + 10}px`;
        nameElement.style.top = `${e.pageY + 10}px`;
      };
      setPosition(event);
    
      // Fade in
      requestAnimationFrame(() => {
        nameElement.style.opacity = 1;
      });
    
      // Add a mousemove listener to update position
      const mouseMoveHandler = (e) => setPosition(e);
    
      // Fade out and clean up on mouseout
      const mouseOutHandler = () => {
        nameElement.style.opacity = 0;
        setTimeout(() => nameElement.remove(), 200); // Ensure removal after fade-out
        document.removeEventListener("mousemove", mouseMoveHandler);
        line.removeEventListener("mouseout", mouseOutHandler);
      };
    
      document.addEventListener("mousemove", mouseMoveHandler);
      line.addEventListener("mouseout", mouseOutHandler);
    }    
    

    function animateLine(d, angle, frame) {
      const targetX = Math.cos(angle) * scale(d.age);
      const targetY = Math.sin(angle) * scale(d.age);
      let progress = 0;
    
      function drawLine() {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(targetX * progress, targetY * progress);
        ctx.strokeStyle = getProgressiveColor(frame); // Use frame color for gradient effect
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.1; // Adjust opacity for visibility
        ctx.stroke();
    
        if (progress < 1) {
          progress += 1 / outwardDuration; // Increment progress
          requestAnimationFrame(drawLine); // Continue drawing
        }
      }
    
      drawLine();
    
      // Add mouseover trigger
      const line = svg.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", centerX + targetX)
        .attr("y2", centerY + targetY)
        .style("stroke", "transparent")
        .style("stroke-width", "10px")
        .on("mouseover", function (event) {
          showNameOnMouse(d, event); // Show name near mouse on hover
        });
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
      setTimeout(animate, radialDelay); // Delay for each line
    }

    animate(); // Start radial animation
  });
}

// Start the visualization
showPlaceholder();
