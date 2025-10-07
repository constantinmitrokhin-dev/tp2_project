
const path = require("path");

class FileList {
	constructor(fullFilePath){
		this.filePath = fullFilePath;
		this.fileName = fullFilePath.split("\\").pop();
		this.fileExt  = path.extname(this.fileName).toLowerCase();
	};

}

module.exports = FileList;
