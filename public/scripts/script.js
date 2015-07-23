$(function() {
	console.log("i'm working");

  // compile profile template
  $template = _.template($('#profile-template').html());

  //get all archived profile posts
	var all = function () {
 		$.get('/api/profiles', function (data) {
      // console.log("getting all profiles")
      var allProfiles = data;
      // console.log(allProfiles);
      // iterate through all profiles
      _.each(allProfiles, function (allProfiles) {
      	$('#current-profiles').append($template(allProfiles))
      });
    });
  }
 
 	all();


 	//submit form 
	$('#profile-form').on('submit', function(event){
	  event.preventDefault();
	  console.log("hello"); 
	  var Profile = {
	  	type: $('#entry-type').val(),
	  	name: $('#entry-name').val(),
	  	age: $('#entry-age').val(),
	  	hobbies: $('#entry-hobbies').val(),
	  	careerAspire: $('#entry-career').val(),
	  	jobs: $('#entry-jobs').val(),
	  	weakness: $('#entry-weakness').val()
	  }
	  $.post('/api/profiles', Profile, function(data) {
	  	console.log(data)
	  		$('#current-profiles').prepend($template(data))
	  })
	})
	
})
