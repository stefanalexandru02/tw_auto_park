$(function() {
    currentFilters = {};
    currentPage = 0;
    currentPageSize = sessionStorage.getItem("elementsPerPage") ? sessionStorage.getItem("elementsPerPage") : 10;
    if(sessionStorage.getItem("elementsPerPage")) {
        $('#elementsPerPageSelector').val(currentPageSize);
    }

    $.ajax({
        url: "/api/statistics/judete",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#judetFilterPicker').append(`<option value=${element.replace(" ", "_")}>${element}</option>`)
            });

            if(window.sessionStorage.getItem('judet') && window.sessionStorage.getItem('judet') !== 'undefined')
            {
                $('#judetFilterPicker').val(window.sessionStorage.getItem('judet'));
                currentFilters['judet'] = window.sessionStorage.getItem('judet');
                reloadTableData();
                window.sessionStorage.setItem('judet', undefined);
            }
        }
    });
    $.ajax({
        url: "/api/statistics/categorii",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#categorieFilterPicker').append(`<option value=${element.replace(" ", "_")}>${element}</option>`)
            });
        }
    });
    $.ajax({
        url: "/api/statistics/ani",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#anFilterPicker').append(`<option value=${element}>${element}</option>`)
            });
        }
    });

    $('#judetFilterPicker').on('change', function() {
        currentFilters['judet'] = this.value; currentPage = 0;
        reloadTableData();
    });
    $('#categorieFilterPicker').on('change', function() {
        currentFilters['categorie'] = this.value; currentPage = 0;
        reloadTableData();
    });
    $('#anFilterPicker').on('change', function() {
        currentFilters['an'] = this.value; currentPage = 0;
        reloadTableData();
    });

    $('#elementsPerPageSelector').on('change', function() {
        currentPageSize = $('#elementsPerPageSelector').val();
        sessionStorage.setItem("elementsPerPage", currentPageSize);
        currentPage = 0;
        reloadTableData();
    });

    $('#paginationBackButton').on('click', function() {
        if(currentPage > 0) currentPage--;
        reloadTableData();
    });
    $('#paginationForwardButton').on('click', function() {
        currentPage++;
        reloadTableData();
    });

    reloadTableData();
});

function selectPage(newPage) {
    currentPage = newPage;
    reloadTableData();
}

let currentFilters = {};
let currentPage = 0;
let currentPageSize = 10;

function reloadTableData() {
    document.getElementById("statisticsDataTable").innerHTML = "";
    document.getElementById("pageListContainer").innerHTML = "";
    let query = `/api/get_statistics?pageIndex=${currentPage}&pageSize=${currentPageSize}`;
    if(currentFilters['judet'] && currentFilters['judet'] != 'TOATE')
    {
        query = `${query}&judet=${currentFilters['judet'].replace(" ", "_")}`;
    }
    if(currentFilters['categorie'] && currentFilters['categorie'] != 'TOATE')
    {
        query = `${query}&categorie=${currentFilters['categorie'].replace(" ", "_")}`;
    }
    if(currentFilters['an'] && currentFilters['an'] != 'TOATE')
    {
        query = `${query}&an=${currentFilters['an']}`;
    }
    $.ajax({
        url: query,
        type: "GET",
        success: function(data) { 
            let numberOfPages = data['totalCount'] / currentPageSize;
            if(parseInt(numberOfPages) < numberOfPages) {
                numberOfPages = parseInt(numberOfPages) + 1;
            } else {numberOfPages = parseInt(numberOfPages); }
            $('#pageListContainer').html(buildPaginationComponent(numberOfPages, currentPage + 1));

            data['elements'].map(row => {
                $('#statisticsDataTable').append(`
                <tr>
                <td>${row['judet']}</td>
                <td>${row['an']}</td>
                <td>${row['marca']}</td>
                <td>${row['categorie']}</td>
                <td>${row['categorie_com']}</td>
                <td>${row['combustibil']}</td>
                <td>${row['desc']}</td>
                <td>${row['total']}</td>
                </tr>`
              );
            });
        }
    });
}

function buildPaginationComponent(totalcount, currentPage) {
    var HTML = "";
    if (totalcount <= 6) {
        for (i = 1; i <= totalcount; i++) {
            HTML += addButton(i);
        }
    } else {
        HTML += addButton("1");
        if (currentPage > 3) {
            HTML += '<a disabled href="#">...</a>';
        }
        if (currentPage == totalcount) {
            HTML += addButton(currentPage - 2);
        }
        if (currentPage > 2) {
            HTML += addButton(currentPage - 1);
        }
        if (currentPage != 1 && currentPage != totalcount) {
            HTML += addButton(currentPage);
        }
        if (currentPage < totalcount - 1) {
            HTML += addButton(currentPage + 1);
        }
        if (currentPage == 1) {
            HTML += addButton(currentPage + 2);
        }
        if (currentPage < totalcount - 2) {
            HTML += '<a disabled href="#">...</a>';
        }
        HTML += addButton(totalcount);
    }
    return HTML;
}

function addButton(number) {
    return `<a class="${number-1 === currentPage ? 'active' : ''}" onclick="selectPage(${number - 1})" href="#">${number}</a>`;
}

function downloadCSV() {
    $('#statisticsDownloadCSVButton').prop('disabled', true);
    let payload = {};
    if(currentFilters['judet'] && currentFilters['judet'] != 'TOATE') {
        payload['judet'] = currentFilters['judet'].replace("_", " ");
    }
    if(currentFilters['categorie'] && currentFilters['categorie'] != 'TOATE') {
        payload['categorie'] = currentFilters['categorie'].replace("_", " ");
    }
    if(currentFilters['an'] && currentFilters['an'] != 'TOATE') {
        payload['an'] = currentFilters['an'];
    }
    $.ajax({
        url: "/api/statistics/generate_csv",
        type: "POST",
        data: JSON.stringify(payload),
        success: function(data) { 
            window.location.href = data;
            $('#statisticsDownloadCSVButton').prop('disabled', false);
        },
        error: function(e) {
            alert("Eroare la generarea fisierului");
            $('#statisticsDownloadCSVButton').prop('disabled', false);
        }
    });   
}


setTimeout(()=>{

var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 500;
myCanvas.height = 340;

var ctx = myCanvas.getContext("2d");

function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

function drawPieSlice(
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  fillColor,
  strokeColor
) {
  ctx.save();
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

class PieChart {
  constructor(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    this.titleOptions = options.titleOptions;
    this.totalValue = [...Object.values(this.options.data)].reduce((a, b) => a + b, 0);
    this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2) - options.padding;
  }

  drawSlices() {
    var colorIndex = 0;
    var startAngle = -Math.PI / 2;

    for (var categ in this.options.data) {
      var val = this.options.data[categ];
      var sliceAngle = (2 * Math.PI * val) / this.totalValue;

      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.radius,
        startAngle,
        startAngle + sliceAngle,
        this.colors[colorIndex % this.colors.length]
      );

      startAngle += sliceAngle;
      colorIndex++;
    }

    if (this.options.doughnutHoleSize) {
      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.doughnutHoleSize * this.radius,
        0,
        2 * Math.PI,
        "#FFF",
        "#FFF"
      );

      drawArc(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.doughnutHoleSize * this.radius,
        0,
        2 * Math.PI,
        "#000"
      );
    }
  }

  drawLabels() {
    var colorIndex = 0;
    var startAngle = -Math.PI / 2;
    for (var categ in this.options.data) {
      var val = this.options.data[categ];
      var sliceAngle = (2 * Math.PI * val) / this.totalValue;
      var labelX =
        this.canvas.width / 2 +
        (this.radius / 2) * Math.cos(startAngle + sliceAngle / 2);
      var labelY =
        this.canvas.height / 2 +
        (this.radius / 2) * Math.sin(startAngle + sliceAngle / 2);

      if (this.options.doughnutHoleSize) {
        var offset = (this.radius * this.options.doughnutHoleSize) / 2;
        labelX =
          this.canvas.width / 2 +
          (offset + this.radius / 2) * Math.cos(startAngle + sliceAngle / 2);
        labelY =
          this.canvas.height / 2 +
          (offset + this.radius / 2) * Math.sin(startAngle + sliceAngle / 2);
      }

      var labelText = Math.round((100 * val) / this.totalValue);
      this.ctx.fillStyle = "black";
      this.ctx.font = "32px Khand";
      this.ctx.fillText(labelText + "%", labelX, labelY);
      startAngle += sliceAngle;
    }
  }

  drawTitle() {
    this.ctx.save();

    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;

    let xPos = this.canvas.width / 2;

    if (this.titleOptions.align == "left") {
      xPos = 10;
    }
    if (this.titleOptions.align == "right") {
      xPos = this.canvas.width - 10;
    }

    this.ctx.fillText(this.options.seriesName, xPos, this.canvas.height);

    this.ctx.restore();
  }

  drawLegend() {
    let pIndex = 0;
    let legend = document.querySelector("div[for='myCanvas']");
    let ul = document.createElement("ul");
    legend.append(ul);

    for (let ctg of Object.keys(this.options.data)) {
      let li = document.createElement("li");
      li.style.listStyle = "none";
      li.style.borderLeft =
        "20px solid " + this.colors[pIndex % this.colors.length];
      li.style.padding = "5px";
      li.textContent = ctg;
      ul.append(li);
      pIndex++;
    }
  }

  draw() {
    this.drawSlices();
    // this.drawLabels();
    this.drawTitle();
    this.drawLegend();
  }
}

var myPiechart = new PieChart({
  canvas: myCanvas,
  seriesName: "Distributie masini",
  padding: 40,
  data: {
    "Classical Music": 16,
    "Alternative Rock": 12,
    "Pop": 18,
    "Jazz": 32
  },
  colors: ["#80DEEA", "#FFE082", "#FFAB91", "#CE93D8"],
  titleOptions: {
    align: "center",
    fill: "black",
    font: {
      weight: "bold",
      size: "18px",
      family: "Lato"
    }
  }
});

myPiechart.draw();
}, 1000);