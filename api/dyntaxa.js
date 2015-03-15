var http = require('http');
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Stack%20Overflow
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//
//
function fetchWiki(req,res){

    var options = {
      host: 'en.wikipedia.org',
      path: '/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Stack%20Overflow'
    };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log("log: ",str.query.pages);
      req.user.save(function(err,user){
        if(err){
          console.log(err);
        }else{
          res.redirect('/');
        }
      });
    });
  }

  http.request(options, callback).end();
}