

let dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let monthOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(window).on('load',function(){
    let class_div = $("#class");

    let settings = {
        "url": "/myclasses",
        "method": "GET",
      };
      
      $.ajax(settings).done(function (response) {
       
            let classes = response.results;
            let dataHtml = `<table class="table px-4 classTable table-hover align-middle table table-striped table-bordered" id="anu_class"><thead>
            <tr class="" style="background-color: #DAA425; color:white;">
              <th scope="col">Teacher</th>
              <th scope="col">Description</th>
              <th scope="col">Start date </th>
              <th scope="col">End date</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
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
              </tr>`
            });
            dataHtml += `</tbody></table>
        <div class='text-center my-5'><a href="/login" class='btn px-2' style="background-color: #DAA425; color: white;"><i class="fa fa-sign-in pl-2"></i> Teacher Login</a></div>`
            class_div.html(dataHtml);
            $('#anu_class').DataTable();
        });

        function getCurrent(){
            let DateString = new Date()
            return DateString.toISOString();
        }
})

