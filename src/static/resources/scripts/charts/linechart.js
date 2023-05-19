class LineChart {
    constructor(options) {
        this.data = options.data;
        this.canvas = options.canvas;
    }
  
    draw() {
        const ctx = this.canvas.getContext('2d');
      
        const labels = Object.keys(this.data);
        const counts = Object.values(this.data);
        const maxCount = Math.max(...counts); 
      
        const chartWidth = this.canvas.width - 20; // Adjusted to fit within the this.canvas
        const chartHeight = this.canvas.height - 40; // Adjusted to fit within the this.canvas
      
        const xStep = chartWidth / (labels.length - 1) - 10;
        const yScale = chartHeight / (maxCount);
      
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
        var bw = this.canvas.width - 50;
        var bh = this.canvas.height - 40;
        var p = 10;
        for (var x = 10; x <= bw; x += 50) {
          ctx.moveTo(0.5 + x + p, p);
          ctx.lineTo(0.5 + x + p, bh + p);
        }
        for (var x = 10; x <= bh; x += 50) {
            ctx.moveTo(p, 0.5 + x + p);
            ctx.lineTo(bw + p, 0.5 + x + p);
        }
        ctx.strokeStyle = "#353b48";
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#64302e";
        ctx.lineWidth = 2;
      
        for (let i = 0; i < labels.length; i++) {
          const label = labels[i];
          const count = counts[i];
      
          const x = i * xStep + 10;
          const y = this.canvas.height - count * yScale - 20 + (100);
      
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
      
          ctx.fillStyle = 'white';
          ctx.font = "12px Serif";
          ctx.fillText(label, x - 10, this.canvas.height - 5);
        }
      
        ctx.stroke();
        ctx.closePath();
      }
      
  }
  