$(document).ready(function(){
   
    let login_buttton = $("#login_btn");
    let message = $("#message");

    login_buttton.on('click',function(e){
        e.preventDefault();
        login_buttton.text("Processing...");
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let settings = {
            "url": "/login",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
            },
            "data": JSON.stringify({
              "username": username,
              "password": password
            }),
          };
          
          $.ajax(settings).done(function(response) {
            if(response.error){
                message.html("<div class='alert alert-danger'>" + response.message + '</div>');
                login_buttton.text("Login");
            }else{
                let url = "/listclasses";
                $(location).attr('href',url);            }
          });
    })
    
})
