$(function() {
    currentFilters = {};
    currentPage = 0;
    currentPageSize = 10;

    $.ajax({
        url: "/api/statistics/judete",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#judetFilterPicker').append(`<option value=${element}>${element}</option>`)
            });
        }
    });
    $.ajax({
        url: "/api/statistics/categorii",
        type: "GET",
        success: function(data) { 
            data.map(element => {
                $('#categorieFilterPicker').append(`<option value=${element}>${element}</option>`)
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

let currentFilters = {};
let currentPage = 0;
let currentPageSize = 10;

function reloadTableData() {
    document.getElementById("statisticsDataTable").innerHTML = "";
    let query = `/api/get_statistics?pageIndex=${currentPage}&pageSize=${currentPageSize}`;
    if(currentFilters['judet'] && currentFilters['judet'] != 'TOATE')
    {
        query = `${query}&judet=${currentFilters['judet']}`;
    }
    if(currentFilters['categorie'] && currentFilters['categorie'] != 'TOATE')
    {
        query = `${query}&categorie=${currentFilters['categorie']}`;
    }
    if(currentFilters['an'] && currentFilters['an'] != 'TOATE')
    {
        query = `${query}&an=${currentFilters['an']}`;
    }
    $.ajax({
        url: query,
        type: "GET",
        success: function(data) { 
            data.map(row => {
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