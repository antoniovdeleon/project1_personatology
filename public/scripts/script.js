// $(function() {

//   console.log('hello');

//   //get all profiles
//   $profile = _.template($('#profile-template').html() );
//   var baseUrl = "http://localhost:3000";

//     $.get(baseUrl + '/api/profiles', function(data) {
//       var profiles = data;

//       _.each(profiles, function(profile) { 
//         console.log(profile);
//         $('#profiles').append($profile(profile));
//       });
//     });
//   });

 
  //get all archived blog posts
 // var all = function (){
 //   $.get('/api/posts', function (data) {
 //     var allVenues = data;
 //     console.log(allVenues);
 //    //iterate through all blog posts
 //     _.each(allVenues, function(data) {

 //       //pass each blog post through template to append to view
 //       var $venueHtml = $(template(data));
 //       console.log($venueHtml);
 //       console.log($('#profile-template'))
 //       $('#profile-template').append($venueHtml);
 //     });
 //   }); 
 // };

 // all()



// TEST
 // $line = _.template( $("#lineTemplate").html() )

 //  $.get(baseUrl + '/api/lines', function(data) {
 //    var lines = data  

 //    _.each(lines, function(line) {
 //      console.log(line)
 //      $('#lines').append($line(line))
 //    })
 //  })

// TEST END




// })