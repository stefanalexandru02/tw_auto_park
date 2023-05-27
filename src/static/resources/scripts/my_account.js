let savedSearches = {};

$(function() {
    $.ajax({
        url: "/api/get_searches",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: function(data) {
            data.map((row,index) => {
                savedSearches[row['id']] = JSON.parse(row['filters']);
                $('#searchesDataTable').append(`
                <tr data-aos="fade-up">
                <td>${row['added_time']}</td>
                <td>${row['nume']} ${index+1}</td>
                <td>
                    <button class="eye-button" onclick="loadSearch(${row['id']})"><i class="fas fa-eye"></i></button>
                </td>
                </tr>`
              ); 
            });
        }
        
    }); 
});

const loadSearch = (id) => {
    window.sessionStorage.clear();
    const filter = savedSearches[id];
    Object.keys(filter).map(key => {
        window.sessionStorage.setItem(key, filter[key]);
    });
    window.location.href='/statistici_detalii.html';
}