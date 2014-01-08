/**
* Created by Freddy Montano
* freddymx@gmail.com
* 
* Removes @2x suffix from file names.
*
* Used for renaming files in the format filename@2x.ext to filename.ext
* Useful for mobile developers that work with iphone and android devices. Usually,
* we get the assets for iPhone, and we need to manually copy and rename to make them 
* work on android.
* 
* Usage: 
* node ./remove_2x.js --dir /my/dir   
* 	Renames all assets inside /my/dir
* node ./remove_2x.js --dir /my/dir --recursive 
* 	Renames all assets insinde /my/dir and every folder inside it.
* 
**/

var fs = require('fs'),
	_ = require('underscore');

/// Using Optimist to handle program arguments
var argv = require('optimist')
    .usage('Usage: $0 [str] ')
    .alias({ 'd':'dir', 'r' : 'recursive' })
    .describe({'d' : 'Directory that contains the files to be renamed', 'r': "Search and rename subfolders."})
    .demand(['d'])
    .argv;

/// Directory we are going to be working on
var dirPath = argv.d;
/// Regular expression that matches files with @2x before the file extension.
var reg = /(.*)@2x(\.[\w\d]{3})/;

processDirectory(dirPath);

/// Gets all files from a directory and process its contents
function processDirectory(dir){
	console.log('*** Checking dir : '+dir);
	/// Getting all files inside current folder
	var files = fs.readdirSync(dir);
	_.each(files, function(file){
		console.log("Checking "+dir+'/'+file);
		/// Checking if this is a directory or a file
		var fstats = fs.statSync(dir+'/'+file);
		/// If we have a directory, then we call make a recursive call with the new found directory
		if( fstats.isDirectory() ){
			console.log("This is a dir.");
			processDirectory(dir+'/'+file)
			
		} else {
			/// If we have a file, then we just go ahead and rename it
			console.log("This is a file");
			processFile(dir, file);
		}
	})
}

/// Function that renames the file
/// TODO: Use a regular expression to do the form the new filename instead of using strings functions
function processFile(dir, filename){
	var oldPath = dir + '/' + filename;
	/// Making sure that the file has the correct name (with @2x.ext) 
	/// and avoiding hidden files
	if(filename[0]!="." && reg.test(filename)){
		/// TODO: make sure a file with the new name does not exists
		var lastIndex = filename.lastIndexOf("@2x");
		/// Removing last instance of @2x 
		var fixedName = filename.substring(0, lastIndex) + filename.substring(lastIndex + 3, filename.length);
		var newPath = dir + '/' + fixedName;
		/// Renaming old file.
		fs.renameSync(oldPath, newPath);
	}	
}


