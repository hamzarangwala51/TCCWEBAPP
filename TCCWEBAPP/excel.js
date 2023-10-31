const fs = require('fs');
const XLSX = require('xlsx');

function getExcelFunc(rowData, yearData) {
  // Combine rowData and yearData into a single array
  const combinedData = rowData.map((data, index) => [data, yearData[index]]);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a new worksheet from the combined data
  const worksheet = XLSX.utils.aoa_to_sheet([['Data', 'Year'], ...combinedData]);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CombinedDataSheet');

  // Define the file name
  let excelFileName = "TCC.xlsx";

  // Write the workbook to a file
  XLSX.writeFile(workbook, excelFileName);

  return excelFileName;
}

module.exports = getExcelFunc;
