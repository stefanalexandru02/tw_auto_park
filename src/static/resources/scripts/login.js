function authenticate()
{
    $.ajax({
        url: "/api/authenticate_user",
        type: "POST",
        data: JSON.stringify({
            "USERNAME": $('#authenticateEmailInputField').val(),
            "PASSWORD": $('#authenticatePasswordInputField').val()
        }),
        success: function(data) { 
            localStorage.setItem("token", data);
            window.location.href = '/';
        },
        error: function(e) {
            alert("Eroare la autentificare");
        }
    });   
}