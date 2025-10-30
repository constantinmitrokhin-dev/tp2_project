
const path = require("path");
const CsvFile = require("./CsvFile");
const ExcelFile = require("./ExcelFile");
// const PdfFile = require("./PdfFile");


class FileFactory {
	static create(fullFilePath) {
		const ext = path.extname(fullFilePath).toLowerCase();

		switch (ext) {
			case ".csv":
				return new CsvFile(fullFilePath);
			case ".xls":
			case ".xlsx":
				return new ExcelFile(fullFilePath);
			// case ".pdf":
			// 	return new PdfFile(fullFilePath);
			default:
				throw new Error(`Tipo de archivo no soportado: ${ext}`);
		}
	}
}

module.exports = FileFactory;
