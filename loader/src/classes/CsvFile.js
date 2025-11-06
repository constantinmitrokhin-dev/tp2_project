
const FileList = require('./FileList');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

class CsvFile extends FileList {
	constructor(fullFilePath) {
		super(fullFilePath);
	}

	async sheetToJSON() {
		const csvContent = await fs.promises.readFile(this.filePath, 'utf8');

		const records = parse(csvContent, {
			columns: true,
			skip_empty_lines: true,
			trim: true
		});

		return records;
	}
}

module.exports = CsvFile;
