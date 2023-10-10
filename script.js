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

      // room mapping
      roomToPositionMapping["3152"] = [parseInt(0.55*resizableImage.clientWidth), parseInt(0.8*resizableImage.clientHeight)]
      roomToPositionMapping["3102"] = [parseInt(0.57*resizableImage.clientWidth), parseInt(0.6*resizableImage.clientHeight)]
      roomToPositionMapping["3219B"] = [parseInt(0.73*resizableImage.clientWidth), parseInt(0.525*resizableImage.clientHeight)]
      roomToPositionMapping["3219T"] = [parseInt(0.73*resizableImage.clientWidth), parseInt(0.325*resizableImage.clientHeight)]
  }

  // Call the function initially and whenever the window is resized
  window.addEventListener('resize', resizeDivs);
  resizeDivs();
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
  const keysArr = Object.keys(roomToPositionMapping);

  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndexStart = Math.floor(Math.random() * keysArr.length);
      const randomIndexEnd = Math.floor(Math.random() * keysArr.length);

      // Create the dot (circle) and set its initial position
      const dot = svg
        .append("circle")
        .attr("cx", roomToPositionMapping[keysArr[randomIndexStart]][0])
        .attr("cy", roomToPositionMapping[keysArr[randomIndexStart]][1])
        .attr("r", 5)
        .attr("fill", "red");

      // Transition the dot's position
      dot
        .transition()
        .duration(3000)
        .attr("cx", roomToPositionMapping[keysArr[randomIndexEnd]][0])
        .attr("cy", roomToPositionMapping[keysArr[randomIndexEnd]][1])
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
    delay += 3500; // Adjust this value to control the gap between dots
  }

  // Wait for all animations to complete
  await Promise.all(animationPromises);

  // All animations are now finished
  console.log("All animations are completed.");
}
  
  