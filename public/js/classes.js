$(window).on('load',function(){
    var class_div = $("#class");

    var settings = {
        "url": "/classes",
        "method": "GET",
      };
      
      $.ajax(settings).done(function (response) {
        if(response.error){
            var url = "/login";
            $(location).attr('href',url);     
        }else{
            var classes = response.results;
            var dataHtml = `<thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Teacher</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col" colspan="3">Action</th>
            </tr>
        </thead> <tbody>`;
            classes.forEach(cls => {
                dataHtml = dataHtml + ` <tr>
                <td><img src="${cls.teacher_avatar}" alt="Avatar"></td>
                <td>${cls.teacher_first_name} ${cls.teacher_last_name}</td>
                <td>${cls.description}</td>
                <td>${cls.end >  getCurrent() ?  "<span class='text-success'>Active</span>": "<span class='text-danger'>Unactive</span>" }</td>
                <td><a class="btn btn-sm ${cls.end >  getCurrent() ?  "btn-success": "disabled btn-secondary"}" href="${cls.room_url}"><i class="fa fa-sign-in"></i> Enter class</a></td>
                <td><a class="btn btn-sm btn-danger" href=""><i class="fa fa-trash"></i> Delete</a></td>
                <td><a class="btn btn-sm btn-warning" href=""><i class="fa fa-edit"></i> Edit</a></td>
              </tr>`
            });
            dataHtml += "</tbody>"
            class_div.html(dataHtml);
        }
      });    
})

function getCurrent(){
    let DateString = new Date()
    return DateString.toISOString();
}
