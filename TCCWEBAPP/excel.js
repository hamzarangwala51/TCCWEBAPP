const fs = require('fs');
const XLSX = require('xlsx');

function getExcelFunc(judgeData, yearData,appeleantnames,outcomeOfCase,typeofIssue,genderofAppellant,genderofJudge,intials,yeartheCasetook,typeofTaxPayer,url_case) {
  // Combine rowData and yearData into a single array
  const combinedData = judgeData.map((data, index) => [data,appeleantnames[index], yearData[index],outcomeOfCase[index],typeofIssue[index],intials[index],yeartheCasetook[index],typeofTaxPayer[index],genderofAppellant[index],genderofJudge[index],url_case[index]]);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a new worksheet from the combined data
  const worksheet = XLSX.utils.aoa_to_sheet([['Judges Names','Appeleant Names','Year','Outcome Of Case','Type of Issue','Inital Comparison','Duration of the Case','Type of Tax Payer','Gender of Appellant','Gender of Judge','URL'], ...combinedData]);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CombinedDataSheet');

  // Define the file name
  let excelFileName = "TCC.xlsx";

  // Write the workbook to a file
  XLSX.writeFile(workbook, excelFileName);

  return excelFileName;
}

module.exports = getExcelFunc;