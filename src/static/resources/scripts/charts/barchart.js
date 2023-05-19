class BarChart {
    constructor(options) {
        this.data = options.data;
        this.canvas = options.canvas;
        this.colors = options.colors;
    }

    // Function to create a bar chart
    draw() {
    // Get the this.canvas element and its context
    const context = this.canvas.getContext("2d");
  
    // Set the chart's dimensions
    const chartWidth = this.canvas.width;
    const chartHeight = this.canvas.height;
  
    // Find the maximum value in the this.data
    const maxCount = Math.max(...Object.values(this.data));
  
    // Calculate the width and spacing for each bar
    const barSpacing = 10;
    const barWidth = (chartWidth / Object.keys(this.data).length) - barSpacing;
  
    // Set the initial x-coordinate for the first bar
    let x = 0;
  
    let index = 0;
    // Loop through the this.data and draw the bars
    for (const [label, count] of Object.entries(this.data)) {
      // Calculate the height of the bar based on the this.data value
      const barHeight = (count / maxCount) * chartHeight;
  
      // Set the color of the bar
      context.fillStyle = this.colors[index++ % this.colors.length];
  
      // Draw the bar
      context.fillRect(x, chartHeight - barHeight - 30, barWidth, barHeight);
  
      // Draw the label below the bar
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(label, x + barWidth / 2, chartHeight - 5);
  
      // Update the x-coordinate for the next bar
      x += barWidth + barSpacing;
    }
  }
}