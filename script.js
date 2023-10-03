const dotRadius = 10;
const dotColor = "blue";
let svg  = null;

window.addEventListener('load', () => {
  const resizableImage = document.getElementById('background-image');
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
          .attr('height', imageHeight)
  }

  // Call the function initially and whenever the window is resized
  window.addEventListener('resize', resizeDivs);
  resizeDivs();
});

document.getElementById('read-csv').addEventListener('click', function () {
    const inputElement = document.getElementById('csv-file-input');
    
    // Check if a file has been selected
    if (inputElement.files.length > 0) {
      const file = inputElement.files[0];
      
      // Create a FileReader object
      const reader = new FileReader();
      
      reader.onload = function (e) {
        const csvData = e.target.result;
        
        // Split the CSV data into lines
        const lines = csvData.split('\n');
        
        // Initialize an array to hold the parsed data
        const data = [];
        
        for(const line of lines) {
          // Create the dot (circle) and set its initial position
          var dot = svg.append("circle")
                      .attr("cx", 10)
                      .attr("cy", 10)
                      .attr("r", 5)
                      .attr("fill", "red");
        
          dot.transition()
            .duration(3000)
            .attr("cx", 1000)   
            .remove()
        }
      };
      
      // Read the CSV file as text
      reader.readAsText(file);
    } else {
      alert('Please select a CSV file first.');
    }
});
  
  