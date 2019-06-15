$("#searchbarsubmitbtn").click(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    var x = '';
    var query = {}
    var form = $(this);
     var tutorprofilecontent = '';
    var subject = $('#subject').val();
    var location = $('#location').val();
    var zipcode = $('#zipcode').val();
    if(subject.length!=0 && location.length!=0 && zipcode.length!=0){
          query = {$and: [{subjects:subject}, {availablearea:location}, {zipcode: zipcode}]};
      }else if(subject.length!=0&&location.length!=0){
        query = {subjects:subject, availablearea:location, zipcode:'400604'};
      }else if(location.length!=0 && zipcode.length!=0){
      query = {subjects:'history', availablearea:location, zipcode: zipcode};
    }else if(subject.length!=0  && zipcode.length!=0){
        query = {subjects:subject, availablearea:'thane', zipcode: zipcode};
      }else if(subject.length!=0){
        query = {subjects:subject, availablearea:'thane', zipcode: '400604'};
      }else if(location.length!=0){
        query = {subjects:'history', availablearea:location, zipcode: '400604'};
      }else if(zipcode.length!=0){
        query = {subjects:'history', availablearea:'thane', zipcode: zipcode};
      }else{
        console.log('nothing');
      }

      x= JSON.stringify(query);

      $.ajax({
           type: "GET",
           url: '/findtutor/filter?search='+x,
           data: form.serialize(), // serializes the form's elements.
           success: function(data){
             console.log(data);
           $.each(data, function(i, tutor){
             console.log('executing');
             tutorprofilecontent += '<div class="col-sm-4 col-md-4">';
             tutorprofilecontent += '<div  class="card" style="width:225px">'
             tutorprofilecontent += '<img class="card-img-top" alt="Card image" style="width:100%" src=/images/'+this.image+'>'
             tutorprofilecontent += '<div  class="card-body tutor-card-body">';
             tutorprofilecontent += '<h4  style="color: #134477;" class="card-title">'+ this.firstname + ' ' + this.lastname+'</h4>';
             tutorprofilecontent += '<p id="emailpara" style="color:#91959a; display:none" class="card-text">' + this.email + '</p>';
             tutorprofilecontent += '<a class="view_tut_btn button btn btn-lg" href=/users/view_tutor?email='+ this.email +'>View Tutor</a>';
             tutorprofilecontent += '</div>';
             tutorprofilecontent += '</div>';
             tutorprofilecontent += '</div>';

           });
           $('#tutorslist').html(tutorprofilecontent);
           sessionStorage.setItem("sessiontutors", tutorprofilecontent);
           console.log(sessionStorage.getItem("sessiontutors"));
           tutorprofilecontent = '';
             window.location.href = '/users/find_tutor';

           },
         });

         //location.href = '/findtutor/find_tutor';

});


function checksub(event) {
  var x = event.key;
		if(!isNaN(x)){
		alert('wrong input, please enter valid subject name');
	}
}
function checklocation(event) {
  var x = event.key;
		if(!isNaN(x)){
		alert('wrong input, please enter valid location');
	}
}
function checkzipcode(element) {

	var max_chars = 6;

	if(element.value.length > max_chars) {
		element.value = element.value.substr(0, max_chars);
		alert('please enter valid zipcode');
	}

}
