const pdfParse = require('pdf-parse');
console.log('Keys:', Object.keys(pdfParse));
console.log('PDFParse type:', typeof pdfParse.PDFParse);
if (pdfParse.PDFParse) {
  console.log('Is constructor:', !!pdfParse.PDFParse.prototype && !!pdfParse.PDFParse.prototype.constructor);
}
