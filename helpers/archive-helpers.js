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
  _.each(urls, function(url){
    var file = fs.openSync(export.paths.archivedSites + '/' + url, "w");
    fs.closeSync(file);

    getter.get(url, file, function(err,res){
      if (!err) console.log(res.file);
    });
  });
};
