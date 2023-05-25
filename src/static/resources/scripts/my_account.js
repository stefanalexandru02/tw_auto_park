$(function() {
    $.ajax({
        url: "/api/get_searches",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: function(data) {
           console.log(data);
        }
    }); 
});