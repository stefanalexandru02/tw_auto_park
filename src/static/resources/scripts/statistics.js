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
    $.ajax({
        url: "/api/get_distribution_chart_data/judete_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            var myCanvas = document.getElementById("myCanvas");
            myCanvas.width = 500;
            myCanvas.height = 340;

            var myPiechart = new PieChart({
                hide_labels: true,
            canvas: myCanvas,
            seriesName: "Distributie masini",
            padding: 40,
            data: compressArrayWithOther(data,5,"judet", "total"),
            colors: ["#80DEEA", "#FFE082", "#FFAB91", "#CE93D8"],
            titleOptions: {
                align: "center",
                fill: "white",
                font: {
                weight: "bold",
                size: "18px",
                family: "Lato"
                }
            }
            });
            myPiechart.draw();

            new BarChart({
                data: compressArrayWithOther(data,5,"judet", "total"),
                canvas: document.getElementById("barChart")
            }).draw();
        }
    }); 
    $.ajax({
        url: "/api/get_distribution_chart_data/categorii_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            new BarChart({
                data: compressArrayWithOther(data,5,"categorie", "total"),
                canvas: document.getElementById("barChart")
            }).draw();
        }
    }); 
    $.ajax({
        url: "/api/get_distribution_chart_data/an_total",
        type: "POST",
        data: JSON.stringify(payload), 
        success: function(data) {
            new LineChart({
                data: compressArrayWithOther(data,5,"an", "total"),
                canvas: document.getElementById("chartCanvas")
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
