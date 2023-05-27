$(function() {
    currentFilters = {};
    currentPage = 0;
    currentPageSize = sessionStorage.getItem("elementsPerPage") ? sessionStorage.getItem("elementsPerPage") : 10;
    if(sessionStorage.getItem("elementsPerPage")) {
        $('#elementsPerPageSelector').val(currentPageSize);
    }

    const token = localStorage.getItem("token");
    if(token === null || token === undefined || token === "") {
        document.getElementById("saveSearchButton").style.display = 'none';
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

            if(window.sessionStorage.getItem('categorie') && window.sessionStorage.getItem('categorie') !== 'undefined')
            {
                $('#categorieFilterPicker').val(window.sessionStorage.getItem('categorie'));
                currentFilters['categorie'] = window.sessionStorage.getItem('categorie');
                reloadTableData();
                window.sessionStorage.setItem('categorie', undefined);
            }
        }
    });
    $.ajax({
        url: "/api/statistics/ani",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#anFilterPicker').append(`<option value=${element}>${element}</option>`)
            });

            if(window.sessionStorage.getItem('an') && window.sessionStorage.getItem('an') !== 'undefined')
            {
                $('#anFilterPicker').val(window.sessionStorage.getItem('an'));
                currentFilters['an'] = window.sessionStorage.getItem('an');
                reloadTableData();
                window.sessionStorage.setItem('an', undefined);
            }
        }
    });

    $.ajax({
        url: "/api/statistics/marca",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#marcaFilterPicker').append(`<option value=${element.replace(" ", "_")}>${element}</option>`)
            });
            if(window.sessionStorage.getItem('marca') && window.sessionStorage.getItem('marca') !== 'undefined')
            {
                $('#marcaFilterPicker').val(window.sessionStorage.getItem('marca'));
                currentFilters['marca'] = window.sessionStorage.getItem('marca');
                reloadTableData();
                window.sessionStorage.setItem('marca', undefined);
            }
        }
    });

    $.ajax({
        url: "/api/statistics/combustibil",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#combustibilFilterPicker').append(`<option value=${element.replace(" ", "_")}>${element}</option>`)
            });
            if(window.sessionStorage.getItem('combustibil') && window.sessionStorage.getItem('combustibil') !== 'undefined')
            {
                $('#combustibilFilterPicker').val(window.sessionStorage.getItem('combustibil'));
                currentFilters['combustibil'] = window.sessionStorage.getItem('combustibil');
                reloadTableData();
                window.sessionStorage.setItem('combustibil', undefined);
            }
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
    $('#marcaFilterPicker').on('change', function() {
        currentFilters['marca'] = this.value; currentPage = 0;
        reloadTableData();
    });
    $('#combustibilFilterPicker').on('change', function() {
        currentFilters['combustibil'] = this.value; currentPage = 0;
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



    $('#myPieChartCanvas').on('dblclick', function() {
        downloadAsWebP(document.getElementById('myPieChartCanvas'));
    });
    $('#barChart').on('dblclick', function() {
        downloadAsWebP(document.getElementById('barChart'));
    });
    $('#myLineChartCanvas').on('dblclick', function() {
        downloadAsWebP(document.getElementById('myLineChartCanvas'));
    });

    $('#saveSearchButton').on('click', function() {
        const token = localStorage.getItem("token");
        if(token === null || token === undefined || token === "") { return; }
        $.ajax({
            url: "/api/save_search",
            type: "POST",
            data: JSON.stringify({
                search: JSON.stringify(currentFilters)
            }), 
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            success: function(data) {
                if(data === 'true' || data === true) {
                    alert("Salvat cu succes");
                } else {
                    alert("Eroare la salvare");
                }
            }
        }); 
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
    const sessionKeys = Object.keys(window.sessionStorage);
    for(let i = 0; i < sessionKeys.length; i++) {
        if(window.sessionStorage[sessionKeys[i]] && 
            window.sessionStorage[sessionKeys[i]] !== 'undefined') {
                setTimeout(()=>{reloadTableData();}, 1000);
                return;
            }
    }

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
    if(currentFilters['marca'] && currentFilters['marca'] != 'TOATE')
    {
        query = `${query}&marca=${currentFilters['marca'].replace(" ", "_")}`;
    }
    if(currentFilters['combustibil'] && currentFilters['combustibil'] != 'TOATE')
    {
        query = `${query}&combustibil=${currentFilters['combustibil'].replace(" ", "_")}`;
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
                <tr data-aos="fade-up">
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

    let payload = {};
    if(currentFilters['judet'] && currentFilters['judet'] != 'TOATE')
    {
        payload['judet'] = currentFilters['judet'];
    }
    if(currentFilters['categorie'] && currentFilters['categorie'] != 'TOATE') {
        payload['categorie'] = currentFilters['categorie'];
    }
    if(currentFilters['an'] && currentFilters['an'] != 'TOATE') {
        payload['an'] = currentFilters['an'];
    }
    if(currentFilters['marca'] && currentFilters['marca'] != 'TOATE') {
        payload['marca'] = currentFilters['marca'];
    }
    if(currentFilters['combustibil'] && currentFilters['combustibil'] != 'TOATE') {
        payload['combustibil'] = currentFilters['combustibil'];
    }
    $.ajax({
        url: "/api/get_distribution_chart_data/judete_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            var myPieChartCanvas = document.getElementById("myPieChartCanvas");
            myPieChartCanvas.width = $("#pieChartContainer").width();
            myPieChartCanvas.height = $("#pieChartContainer").height();

            var myPiechart = new PieChart({
                hide_labels: true,
            canvas: myPieChartCanvas,
            seriesName: "Distributie masini",
            padding: 40,
            doughnutHoleSize: 0.4,
            data: compressArrayWithOther(data,5,"judet", "total"),
            colors: ["#74413e","#975451","#a05651","#de827a","#bf8784","#64302e",],
            titleOptions: {
                align: "center",
                fill: "white",
                font: {
                weight: "bold",
                size: "18px",
                family: "Serif"
                }
            }
            });
            myPiechart.draw();
        }
    }); 
    $.ajax({
        url: "/api/get_distribution_chart_data/categorii_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            const canvas = document.getElementById("barChart");
            canvas.width = $('#barChartContainer').width();
            canvas.height = $('#barChartContainer').height();
            new BarChart({
                data: compressArrayWithOther(data,8,"categorie", "total"),
                colors: ["#74413e","#975451","#a05651","#de827a","#bf8784","#64302e",],
                canvas: canvas
            }).draw();
        }
    }); 
    $.ajax({
        url: "/api/get_distribution_chart_data/an_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            const canvas = document.getElementById("myLineChartCanvas");
            canvas.width = $("#myLineChartContainer").width();
            canvas.height = $("#myLineChartContainer").height();
            new LineChart({
                data: compressArrayWithoutOther(data,"an", "total"),
                canvas: canvas
            }).draw();
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
    if(currentFilters['combustibil'] && currentFilters['combustibil'] != 'TOATE') {
        payload['combustibil'] = currentFilters['combustibil'].replace("_", " ");
    }
    if(currentFilters['marca'] && currentFilters['marca'] != 'TOATE') {
        payload['marca'] = currentFilters['marca'].replace("_", " ");
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

function downloadAsWebP(canvas) {
    let canvasUrl = canvas.toDataURL('image/webp');
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "chart.webp";
    createEl.click();
    createEl.remove();
}