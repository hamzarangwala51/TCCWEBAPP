const fs = require('fs');
const path = require('path');

function  readJSONFilesFromFolder(folderName,fileNameJSON){
  // Get the full path to the folder (assuming it's in the same directory as the script)
  const folderPath = path.join(__dirname, folderName);

  // Get a list of file names in the folder
  const fileNames = fs.readdirSync(folderPath);

  // Array to store JSON data from files
  const jsonDataArray = [];

  // Loop through each file in the folder
  fileNames.forEach(fileName => {
    
    if(fileName.match(fileNameJSON)){
    // Create the full path to the file
    const filePath = path.join(folderPath, fileName);

    // Read the content of the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    try {
      // Parse the JSON content and push it to the array
      const jsonData = JSON.parse(fileContent);
      jsonDataArray.push(jsonData);
    } catch (error) {
      console.error(`Error parsing JSON file ${fileName}: ${error.message}`);
    }
   }
  });
  return jsonDataArray;
}

// Example usage with a folder named "jsonFolder" in the same directory
module.exports = readJSONFilesFromFolder;
