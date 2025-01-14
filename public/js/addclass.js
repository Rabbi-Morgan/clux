$(document).ready(()=>{
    $("#add_btn").on('click', function(e){
        e.preventDefault();
        $("#add_btn").text = "Processing...";
        // var description = $("description").value
        let description = document.getElementById("description").value;
        // var start = $("#start").value;
        let start = document.getElementById("start").value
        // var end = $("#end").value;
        let end = document.getElementById("end").value
        var message = $("#message");

        // var max_participants = $("#max_participants").value;
        let max_participants = document.getElementById("max_participants").value
        // var record_class = $("record_class").value
        let record_class = document.getElementById("record_class").checked

        var settings = {
            "url": "/addclass",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
            },
            "data": JSON.stringify({
              "description": description,
              "start": start,
              "end": end,
              "max_participants": max_participants,
              "record_class": record_class,
            }),
          };
          // console.log(settings.data)
          $.ajax(settings).done( response=>{
            if(!response.error){
                var url = "/listclasses";
                window.location.href  = url
              }
          });
    })
   
})


function myDateToIso(date){
    var dtx = new Date(date);
    return dtx.toISOString();
}
