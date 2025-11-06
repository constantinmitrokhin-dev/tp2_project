
const FileList = require('./FileList');
const fs = require('fs');
const xlsx = require('xlsx');
const unzipper = require('unzipper');
const path = require('path');

class ExcelFile extends FileList{
	constructor(fullFilePath){
		super(fullFilePath);
	};

	async sheetToJSON(){
		await this.extractExcelImages();
		const workbook = xlsx.readFile(this.filePath);
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		return xlsx.utils.sheet_to_json(sheet);
	}

	async  extractExcelImages(){
		const OUTPUT_DIR = path.join(__dirname, '..', '..', 'data', 'images');
		if (!fs.existsSync(OUTPUT_DIR)) {
			fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		}
		await fs.createReadStream(this.filePath)
			.pipe(unzipper.Parse())
			.on('entry', function (entry) {
			const fileName = entry.path;
			if (fileName.startsWith('xl/media/')) {
				const outPath = `${OUTPUT_DIR}/${fileName.replace('xl/media/', '')}`;
				entry.pipe(fs.createWriteStream(outPath));
			} else {
				entry.autodrain();
			}
		});
	}

}

module.exports = ExcelFile;