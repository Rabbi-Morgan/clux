let dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let monthOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
              <th scope="col">Teacher</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">End date</th>
              <th scope="col">Status</th>
              <th scope="col">Join</th>
              <th scope="col">Delete</th>
              <th scope="col">Edit</th>
            </tr>
        </thead> <tbody>`;
            classes.forEach(cls => {
                let startDate = new Date(cls.start);
              let endDate = new Date(cls.end);
                dataHtml = dataHtml + ` <tr>
                <td><div class="d-flex align-items-center">
          <img
              src="${cls.teacher_avatar}"
              alt=""
              style="width: 45px; height: 45px"
              class="rounded-circle"
              />
          <div class="ms-3">
            <p class="fw-bold mb-1">${cls.teacher_first_name} ${cls.teacher_last_name}</p>
            </div>
        </div>
                </td>
                <td>${cls.description}</td>
                <td class="p">${dayOfWeek[startDate.getDay()]} ${monthOfYear[startDate.getMonth()]} ${startDate.getDate()} ${startDate.getFullYear()} ${startDate.getHours()>12? startDate.getHours()-12:startDate.getHours()}:${startDate.getMinutes()} ${startDate.getHours() > 12? "PM":"AM"}</td>
                <td>${dayOfWeek[endDate.getDay()]} ${monthOfYear[endDate.getMonth()]} ${endDate.getDate()} ${endDate.getFullYear()} ${endDate.getHours()>12? endDate.getHours()-12:endDate.getHours()}:${endDate.getMinutes()} ${endDate.getHours() > 12? "PM":"AM"}</td>
                <td>${cls.end >  getCurrent() ?  "<span class='badge text-success  d-inline'><span class='bg-success mx-1 rounded-circle d-inline-block' style='width: 6px; height: 6px' ></span>Active</span>": "<span class='badge text-danger'><span class='bg-danger mx-1 rounded-circle d-inline-block' style='width: 6px; height: 6px' ></span>Past</span>" }</td>
                <td><a class="btn btn-sm ${cls.end >  getCurrent() ?  "btn-success": "disabled btn-secondary"}" href="${cls.room_url}" ><i class="fa fa-sign-in"></i> Enter class</a></td>
                <td><a class="btn btn-sm btn-danger" href="/class/delete/${cls.uuid}/"><i class="fa fa-trash"></i> Delete</a></td>
                <td><a class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#${cls.slug}" href="/class/edit/${cls.uuid}/"><i class="fa fa-edit"></i> Edit</a> <div class="modal fade" id="${cls.slug}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Edit Class</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form method="POST" action="/class/edit/${cls.uuid}/">
                        <input class="form-control" type="hidden" name="room_token" value="${cls.room_token}">
                            <div class="form-floating mb-3">
                                <textarea class="form-control" placeholder="Enter a description" style="height: 100px" name="description">${cls.description}</textarea>
                                <label for="floatingTextarea2">Description</label>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <label for="start">Start date</label>
                                    <input class="form-control" type="datetime-local" name="start" value="${datetimeLocal(cls.start)}">
                                </div>
                                <div class="col">
                                    <label for="end">End date</label>
                                    <input class="form-control" type="datetime-local" name="end" value="${datetimeLocal(cls.start)}">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block w-100 rounded px-4 py-2 mt-3"><i class="fa fa-edit"></i> Edit</button>
                        </form>
                    </div>
                  </div>
                </div>
              </div></td>
              </tr>`
            });
            dataHtml += "</tbody>"
            class_div.html(dataHtml);
            $('#class').DataTable();
        }
      });    
})

function getCurrent(){
    let DateString = new Date()
    return DateString.toISOString();
}

function datetimeLocal(datetime) {
  const dt = new Date(datetime);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
}
