const dotRadius = 10;
const dotColor = "blue";
const runAnimationButton = document.getElementById('read-csv');
const resizableImage = document.getElementById('background-image');
let svg  = null;

// mapping for room number to x,y offset on screen
const roomToPositionMapping = {};

window.addEventListener('load', () => {
  const dotContainer = document.getElementById('dot-container');

  function resizeDivs() {
      if(svg) {
        svg.remove();
      }

      const imageWidth = resizableImage.clientWidth;
      const imageHeight = resizableImage.clientHeight;

      // Set the width and height of divs to match the image
      dotContainer.style.width = `${imageWidth}px`;
      dotContainer.style.height = `${imageHeight}px`;

      svg = d3.select('#dot-container')
          .append('svg')
          .attr('width', imageWidth)
          .attr('height', imageHeight);
  }

  // Call the function initially and whenever the window is resized
  window.addEventListener('resize', resizeDivs);
  resizeDivs();

  // starting code to initialize the room mapping
  for (let i = 2202; i <= 2274; i += 2) {
    roomToPositionMapping[i+""] = [-1,-1];
  }

  for (let i = 2203; i <= 2239; i += 2) {
    roomToPositionMapping[i+""] = [-1,-1];
  }

  for (let i = 2102; i <= 2154; i += 2) {
    roomToPositionMapping[i+""] = [-1,-1];
  }

  for (let i = 2115; i <= 2131; i += 2) {
    roomToPositionMapping[i+""] = [-1,-1];
  }
});

runAnimationButton.addEventListener('click', function () {
    runAnimationButton.disabled = true;

    const inputElement = document.getElementById('csv-file-input');
    
    // Check if a file has been selected
    if (inputElement.files.length > 0) {
      const file = inputElement.files[0];
      
      // Create a FileReader object
      const reader = new FileReader();
      
      reader.onload = async function (e) {
        const csvData = e.target.result;
        
        // Split the CSV data into lines
        const lines = csvData.split('\n');

        // Call the animateDots function with your 'lines' array
        await animateDots(lines);

        runAnimationButton.disabled = false;

        alert("Animation Finished!");
      };
      
      // Read the CSV file as text
      reader.readAsText(file);
    } else {
      alert('Please select a CSV file first.');
    }
});

function animateDot(line, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create the dot (circle) and set its initial position
      const dot = svg
        .append("circle")
        .attr("cx", parseInt(Math.random()*resizableImage.clientWidth))
        .attr("cy", parseInt(Math.random()*resizableImage.clientHeight))
        .attr("r", 5)
        .attr("fill", "red");

      // Transition the dot's position
      dot
        .transition()
        .duration(3000)
        .attr("cx", parseInt(Math.random()*resizableImage.clientWidth))
        .attr("cy", parseInt(Math.random()*resizableImage.clientHeight))
        .remove()
        .on("end", () => {
          resolve(); // Resolve the Promise when the animation is done
        });
    }, delay);
  });
}

async function animateDots(lines) {
  let delay = 0; // Initial delay for the first dot
  const animationPromises = [];

  for (const line of lines) {
    animationPromises.push(animateDot(line, delay));
    delay += 3000; // Adjust this value to control the gap between dots
  }

  // Wait for all animations to complete
  await Promise.all(animationPromises);

  // All animations are now finished
  console.log("All animations are completed.");
}
  
  