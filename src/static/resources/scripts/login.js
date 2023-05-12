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
function register()
{   
    if($('#authenticatePasswordInputField').val() != 
        $('#authenticatePasswordConfirmInputField').val()) {
        alert("Eroare la autentificare");
        return;
    }

    $.ajax({
        url: "/api/register_user",
        type: "POST",
        data: JSON.stringify({
            "USERNAME": $('#authenticateEmailInputField').val(),
            "PASSWORD": $('#authenticatePasswordInputField').val()
        }),
        success: function(data) { 
            if(data == 'OK')
                window.location.href = '/login.html';
            else alert(data);
        },
        error: function(e) {
            alert("Eroare la autentificare");
        }
    });   
}