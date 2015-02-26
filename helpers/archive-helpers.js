var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var getter = require('http-request')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
//exports.archive = [];
exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, function(err, data){
    cb(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(target){
  var urls = fs.readFileSync(exports.paths.list).toString().split('\n');
  return _.contains(urls, target);
};

// exports.readListOfUrls = function() {
//   return fs.readFileSync(exports.paths.list).toString().split('\n');
// };

exports.addUrlToList = function(url){
  if (!exports.isUrlInList(url)){
    fs.appendFile(exports.paths.list, url.toString() + '\n', function (err){
      if (err) {throw err;}
      console.log('data appended');
    });
  } else {
    console.log('url already in list');
  }
};

exports.isURLArchived = function(url){

  return _.contains(fs.readdirSync(exports.paths.archivedSites),url);
};

exports.returnUrl = function(url){
  return fs.readFileSync(exports.paths.archivedSites + '/'  + url).toString();
};

exports.downloadUrls = function(urls){

  fs.writeFile(exports.paths.list, "", function(err, data){
    console.log("clear");
  });

  urls.pop() //remove trailing newline

  _.each(urls, function(url){
    var path = exports.paths.archivedSites + '/' + url;
    fs.open(path, 'w', function(err, fd){
      getter.get(url, path, function(err, res){
        fs.close(fd);

      });
    });
  });
  // _.each(urls, function(url){
  //   if (url !== '') {
  //     console.log(exports.paths.archivedSites + '/' + url);
  //     var file = fs.open(exports.paths.archivedSites + '/' + url, "w", function(err, fd){
  //       console.log('file: ' + fd);
  //       fs.closeSync(fd);
  //       console.log('past close');
  //     });
  //     console.log('outside open');
  //   }
};
