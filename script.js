const dotRadius = 10;
const dotColor = "blue";
const runAnimationButton = document.getElementById('read-csv');
const resizableImage = document.getElementById('background-image');
const fileSelector = document.getElementById('csv-file-input');
let svg  = null;

// mapping for room number to x,y offset on screen
const roomToPositionMapping = {};

const nodeToRoomMapping = {
  "0": "3152",
  "1": "3102",
  "2": "3219B"
};

fileSelector.addEventListener('click', (e) => {
  e.target.value = null;
});

fileSelector.addEventListener('input', (e) => {
  const selectedFile = fileSelector.files[0];

  if (!selectedFile) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const csvData = e.target.result;

    console.log(csvData);

    const lines = csvData.split('\n').map(line => line.trim());
    
    for(let i = 0; i < lines.length; i++) {
      const data = lines[i].split(',');

      nodeToRoomMapping[data[0]] = data[1];
    }
  };

  reader.readAsText(selectedFile);
})

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

    fetch('Loom-Time-Series-Data - Sheet1.csv')
      .then(response => {
        if (!response.ok) {
          alert(`Failed to fetch CSV file: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(async csvData => {
        // Split the CSV data into lines
        const lines = csvData.split('\n').map(line => line.trim());

        // Call the animateDots function with your 'lines' array
        await animateDots(lines);

        runAnimationButton.disabled = false;

        alert("Animation Finished!");
      })
      .catch(error => {
        console.error('Error:', error);
      });
});

function animateDot(line, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create the dot (circle) and set its initial position
      const dot = svg
        .append("circle")
        .attr("cx", roomToPositionMapping[nodeToRoomMapping[line[1]]][0])
        .attr("cy", roomToPositionMapping[nodeToRoomMapping[line[1]]][1])
        .attr("r", 5)
        .attr("fill", "red");

      // Transition the dot's position
      dot
        .transition()
        .duration(1000)
        .attr("cx", roomToPositionMapping[nodeToRoomMapping[line[2]]][0])
        .attr("cy", roomToPositionMapping[nodeToRoomMapping[line[2]]][1])
        .remove()
        .on("end", () => {
          resolve(); // Resolve the Promise when the animation is done
        });
    }, delay);
  });
}

async function animateDots(lines) {
  const animationPromises = [];

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(",");

    // times 1000 here since test CSV file increments time by 1
    animationPromises.push(animateDot(data, parseInt(data[0])*1000));
  }

  // Wait for all animations to complete
  await Promise.all(animationPromises);
}
  
  