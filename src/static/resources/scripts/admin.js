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
    
    $.ajax({
        url: "/api/get_admin_statistics_register_users",
        type: "GET",
        success: function(data) {
            const canvas = document.getElementById("myLineChartCanvas");
            canvas.width = $("#myLineChartContainer").width();
            canvas.height = $("#myLineChartContainer").height();
            new BarChart({
                data: compressArrayWithoutOther(data,"data", "numar"),
                colors: ["#74413e","#975451","#a05651","#de827a","#bf8784","#64302e",],
                canvas: canvas
            }).draw();
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