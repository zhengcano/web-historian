var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  var respond = function(res, message, statusCode, contentType){
    var defaultCorsHeaders = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, accept",
      "access-control-max-age": 10 // Seconds.
    };
    defaultCorsHeaders['content-type'] = contentType;
    res.writeHead(statusCode, defaultCorsHeaders);
    res.end(message);
  };

  var actions = {
    GET: function(){
      var paths = {
        '/' : function() {
          fs.readFile('./web/public/index.html', function(err, data){
            respond(res, data, 200, "text/html");
          });
        },
        '/styles.css': function(){
          fs.readFile('./web/public/styles.css', function(err, data){
            respond(res, data, 200, "text/css");
          });
        }
      };
      console.log(req.url);
      var path = paths[req.url];
      if (path){
        path();
      } else {
        var site = req.url.slice(1);
        if (archive.isURLArchived(site)){
          respond(res, archive.returnUrl(site),200)
        } else {
          respond(res, "not found", 404);
        }
      }
    },

    POST: function(){
      var data = "";
      req.on('data', function(chunk){
        data += chunk;
      });

      req.on('end', function(){
        //console.log(data.split('=')[1]);
        var site = data.split('=')[1];
        if (!archive.isURLArchived(site)){
          archive.addUrlToList(site);
          fs.readFile('./web/public/loading.html', function(err, data){
            respond(res, data, 302, "text/html");
          });
        } else {
          respond(res, archive.returnUrl(site), 200, "text/html");

        }

      });
    }
  };

  var action = actions[req.method];
  if (action){
    action();
  } else {
    //We'll handle errors here
  }

  //res.end(archive.paths.list);
};
