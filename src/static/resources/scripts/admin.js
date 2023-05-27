let savedMessages = {};

$(function() {
    $.ajax({
        url: "/api/mesaje",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: function(data) {
            data.map((row) => {
                $('#messagesDataTable').append(`
                <tr data-aos="fade-up">
                <td>${row['added_time']}</td>
                <td>${row['mesaj']}</td>
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