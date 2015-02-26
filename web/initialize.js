var fs = require('fs');
//var helpers = require('./helpers/archive-helpers.js');

// Sync is ok here because this is called just once on startup.
module.exports = function () {
  // if the archive folder doesn't exist, create it.
  if (!fs.existsSync("./archives")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("./archives");
  }

  // if the file doesn't exist, create it.
  if (!fs.existsSync("./archives/sites.txt")) {
    // We use fs.openSync to create the file
    var file = fs.openSync("./archives/sites.txt", "w");
    fs.closeSync(file);
  }
  // else {
  //   //populate array
  //   var list = fs.readFileSync("./archives/sites.txt");
  //   list = list.split("/n");
  //   for (var i = 0; i < list.length; i++){
  //     helpers.archive.push(list[i]);
  //   }
  // }

  // if the folder doesn't exist, create it.
  if (!fs.existsSync("./archives/sites")) {
    // We use fs.mkdirSync to create the folder
    fs.mkdirSync("./archives/sites");
  }
};
