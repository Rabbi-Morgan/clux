let dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let monthOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const CLUX_PUBK = "e7d9bb8617ca082c594fbeb1"
const CLUX_PUBK = "23c3890de2e94adfba5b1acc"

$(window).on('load',function(){
    let class_div = $("#class");

    let settings = {
        "url": "/classes",
        "method": "GET",
      };
      
      $.ajax(settings).done(function (response) {
        if(response.error){
            let url = "/login";
            $(location).attr('href',url);     
        }else{
            let classes = response.results;
            let dataHtml = `<thead class="tableHead table-secondary">
            <tr>
              <th scope="col">Teacher</th>
              <th scope="col">Description</th>
              <th scope="col">Start date</th>
              <th scope="col">End date</th>
              <th scope="col">Status</th>
              <th scope="col">Join</th>
              <th scope="col">Delete</th>
              <th scope="col">Edit</th>
            </tr>
        </thead> <tbody>`;
            classes.forEach(cls => {
              let startServerDate = new Date(cls.start);
              let startDate = returnLocalTime(startServerDate)
              let endServerDate = new Date(cls.end)
              let endDate = returnLocalTime(endServerDate)
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
                <td class="p">${dayOfWeek[startDate.getDay()]} ${monthOfYear[startDate.getMonth()]} ${startDate.getDate()} ${startDate.getFullYear()} ${startDate.getHours()>12? startDate.getHours()-12:startDate.getHours()}:${startDate.getMinutes()} ${startDate.getHours() > 11? "PM":"AM"}</td>
                <td>${dayOfWeek[endDate.getDay()]} ${monthOfYear[endDate.getMonth()]} ${endDate.getDate()} ${endDate.getFullYear()} ${endDate.getHours()>12? endDate.getHours()-12:endDate.getHours()}:${endDate.getMinutes()} ${endDate.getHours() > 12? "PM":"AM"}</td>
                <td>${endDate >  new Date() ?  "<span class='badge text-success  d-inline'><span class='bg-success mx-1 rounded-circle d-inline-block' style='width: 6px; height: 6px' ></span>Active</span>": "<span class='badge text-danger'><span class='bg-danger mx-1 rounded-circle d-inline-block' style='width: 6px; height: 6px' ></span>Past</span>" }</td>
                <td><a class="btn py-2 px-4 btn-sm fw-bold ${endDate >  new Date() ?  "btn-success": "disabled btn-secondary"}" target="_blank" href="https://app.learncube.com/api/virtual-classroom/class/start/?pub_key=${CLUX_PUBK}&room_token=${cls.room_token}&userid=648013" >Enter class <i class="fa fa-arrow-right pl-2"></i></a></td>
                <td><a class="btn py-2 px-4 btn-sm fw-bold btn-danger" href="/class/delete/${cls.uuid}/">Delete <i class="fa fa-trash"></i></a></td>
                <td><a class="btn py-2 px-4 btn-sm fw-bold text-white btnBlue btn-warning" data-bs-toggle="modal" data-bs-target="#${cls.slug}" href="/class/edit/${cls.uuid}/"> Edit <i class="fa fa-pen"></i></a> <div class="modal fade" id="${cls.slug}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            <button type="submit" class="btn text-white btn-primary btn-block w-100 rounded px-4 py-2 mt-3 editBtn"><i class="fa fa-edit "></i> Edit</button>
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

function returnLocalTime(dateData) {
  return new Date(dateData.getTime() + dateData.getTimezoneOffset() * 60000)
}
