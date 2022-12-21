$(window).on('load',function(){
    var class_div = $("#class");

    var settings = {
        "url": "/myclasses",
        "method": "GET",
      };
      
      $.ajax(settings).done(function (response) {
       
            var classes = response.results;
            var dataHtml = `<table class="table table-striped table-hover table-bordered"><thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Teacher</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
        </thead> <tbody>`;
            classes.forEach(cls => {
                dataHtml = dataHtml + ` <tr>
                <td><img src="${cls.teacher_avatar}" alt="Avatar"></td>
                <td>${cls.teacher_first_name} ${cls.teacher_last_name}</td>
                <td>${cls.description}</td>
                <td>${cls.end >  getCurrent() ?  "<span class='text-success'>Active</span>": "<span class='text-danger'>Unactive</span>" }</td>
                <td><a class="btn btn-sm ${cls.end >  getCurrent() ?  "btn-success": "disabled btn-secondary"}" href="${cls.room_url}" ><i class="fa fa-sign-in"></i> Enter class</a></td>
              </tr>`
            });
            dataHtml += `</tbody></table><div class='text-center my-3'><a href="/login" class='btn btn-primary'><i class="fa fa-sign-in"></i> Teacher Login</a></div>`
            class_div.html(dataHtml);
        });

        function getCurrent(){
            let DateString = new Date()
            return DateString.toISOString();
        }
})
