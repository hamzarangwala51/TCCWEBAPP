const express = require('express');
const multer = require('multer');
const fs = require('fs');
const JsonDataHandler = require('./jsonModel');
const generateResponse = require('./Api/api.js');
const getExcelFunc = require('./excel.js');
const app = express();
const port = 3000;
const ejs = require('ejs');
const { match } = require('assert');
let uploadedFile;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up multer for file uploads
const storage = multer.memoryStorage(); // You can also use 'diskStorage' for saving to disk
const upload = multer({ storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype === 'application/json') {
            callback(null, true);
        } else {
            callback(new Error('Only JSON files are allowed.'));
        }
    }
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});
// app.get('/upload', (req, res) => {
//     // Load and send the HTML file as a response
//     res.sendFile(__dirname + '/download.html');
// });
// Handle file upload
app.get('/loading', (req, res) => {
    res.render('loading');
});

const storeUploadedFile = (req, res, next) => {
    uploadedFile = req.file;
    next(); // Continue to the next middleware or route
};
app.post('/upload', upload.single('jsonFile'),storeUploadedFile, (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.redirect('/loading');
    // Convert the uploaded file buffer to a JSON object
   
});
app.get('/results', (req, res) => {
    if (!uploadedFile) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const json = JSON.parse(uploadedFile.buffer.toString());
        console.log(uploadedFile.originalname);
            const jsonDataHandler = new JsonDataHandler(json);
                let cit=jsonDataHandler.printSpecificItems();
                let TestFirstName=jsonDataHandler.printSpecificItems();
                let JudgeNames = jsonDataHandler.printSpecificItems();
                    const extractedStrings = [];
                    const appeleantnames =[];
                    const yearOfCase =[];
                    const Judgnames = [];
                    const ResponseFromAi = [];
                    const pattern = /BETWEEN:\s*\n(.+?),/;
                    const patternTEST = /BETWEEN:\s*\n(.*?)\n/;
                    //const patternTEST = /BETWEEN:\s*\n([^,]+)/;
                    //const patternFrench =/ENTRE\s*:\s*\n(.+?),/;
                    const corporationPattern = /\b(?:Inc\.|INC\.|Corp\.|Ltd\.|LTD\.|LLC)\.?$/i;
                    const JudgPattern=/\n(?:By|Before|BEFORE): The Honourable (Judge|Justice|Deputy Judge)? ([^\n]+)\n/i;
                    const patternForJUD = /(\nBY:\s*\n(.*?)\n|\nBEFORE[\s\S]*?\n|\nBefore[\s\S]*?\n|\nBy[\s\S]*?\n)/;
                    const patternifNamenotFound = /\nREASONS FOR JUDGMENT BY:\nThe Honourable(?: (Judge|Justice|Deputy Judge|Associate Chief Judge))? (.*?)\n/i;



                   // const patternifNamenotFound = /\nREASONS FOR JUDGMENT BY:\nThe Honourable (Judge|Justice|Deputy Judge|Associate Chief Judge)? (.*?)\n/i;;
                   // const JuduPattern = /\n(?:Before|BEFORE|By):\s*The Honourable (?:Judge|Justice|Deputy Judge)? ([^\n]+)/i


                    const judgePattern = /\n(?:BEFORE|By): The Honourable [^\n]+,\n/gi;
                    
                    const JudPattern = /\n(By|Before): The Honourable (Judge|Justice|Deputy Judge|Associate Chief Judge)?([^\n,]+)\n/i;


                    const judgeNamePattern = /The Honourable(?: (Judge|Justice|Deputy Judge|Associate Chief Judge))? (.*?)\n/;
                    
                        // Extract the text property from the object

                        // Use regular expressions to find and store matching strings in the array
                       // const matches = TestFirstName[0].match(pattern);
                       json.forEach((text)=>{
                            const match = text.unofficial_text.match(patternTEST);
                            if (match) {
                                const isCorporation =corporationPattern.test(match[1]);
                                if(isCorporation){
                                    extractedStrings.push(match[1]);
                                }else{
                                    extractedStrings.push(match[1]);
                                }
                            }else{
                                extractedStrings.push("Not Found");
                            }
                            // else{
                            //     //console.log(text.name.toString());
                            // }
                       });
                    //    TestFirstName.forEach((text) => {
                    //     const match = text.match(pattern);
                    //     if (match) {
                    //         const isCorporation =corporationPattern.test(match[1]);
                    //         if(isCorporation){
                    //             corpnames.push(match[1]);
                    //         }else{
                    //             extractedStrings.push(match[1]);
                    //         }
                    //     }
                    //   });
                            json.forEach((item)=>{
                                    const year = item.year.toString();
                                    if(item.year!=null){
                                    yearOfCase.push(year);
                                }else{
                                    yearOfCase.push("Year not Found");
                                }
                            });
                       
                            json.forEach((item)=>{
                               const object=patternForJUD.exec(item.unofficial_text);  
                               if(object!=null && object){  
                               const match = object[0].match(JudPattern);
                                if(match){
                                    //Judgnames.push(object[0]);
                                    Judgnames.push(match[3]);
                                }else{
                                    const judgeNamePattern = /(?:By|Before): The Honourable (.*?)\s*,/;
                                        const match1=object[1].match(judgeNamePattern);
                                        if (match1 && match1[1]) {
                                            Judgnames.push(match1[1]);
                                    }else{
                                    Judgnames.push(object[1]);
                                }
                                   // console.log(item.name.toString());
                                }
                            }else{
                                const obj =item.unofficial_text.match(patternifNamenotFound);
                                if(obj){
                                    Judgnames.push(obj[2]);
                                }
                                else{
                                    const mat = item.unofficial_text.match(judgeNamePattern);
                                    if(mat){
                                        Judgnames.push(mat[2])
                                    }else{
                                         Judgnames.push("JudgeName Not Found in Pattern also ")
                                    }
                                    //Judgnames.push("JudgeName Not Found in Pattern also ")
                                }
                                //Judgnames.push("JudgeName Not Found in Object")
                            }
                          
                          });
                          console.log(extractedStrings.length.toString());
                          //console.log(corpnames.length);
                          //console.log(cit.length);
                          console.log(Judgnames.length);  
                                 const promises = [ 
                                    // generateResponse(("Please tell me these features: Winning/Losing/Partially Winning, How many years did the case take?, Name of the Judge, Name of the Appellant, Gender of the Appellant, Gender of the Judge, Type of issue (income tax; excise tax; anything else), Type of taxpayer (individual; corporation)Only include corporations (Inc./Ltd.) if the shareholders are individuals and are named:")+cit[1].toString())
                                    // .then(response => {
                                    //    ResponseFromAi.push(response.toString());
                                    //   console.log('Result:', response);
                                    // })
                                    // .catch(err => {
                                    //   console.error('Error:', err);
                                    // }),
                                     ];
                                
                                
                                   
                               
                             Promise.all(promises)
                                .then(
                                    results => {
                                        const excelFileName = getExcelFunc(Judgnames,yearOfCase,extractedStrings);
                                        console.log(ResponseFromAi);
                                        const temp = {extractedStrings,cit,JsonFilename:uploadedFile.originalname,Judgnames,yearOfCase,ResponseFromAi,excelFileName};
                                        res.render('download',temp);
                                
                                         
                                 
                                  // All promises have resolved, and results is an array of their resolved values
                                  //console.log('All promises have resolved:', results);
                                })
                                .catch(error => {
                                  // Handle any errors that occur during the promises
                                  console.error('An error occurred:', error);
                                });

                                
                                                         
                          

                // var firstName = [];

                // var lastName = [];
                // var result = [];
                // var newNames = tempName.toString().replaceAll(", ", ",");
                //     var fullName = newNames.split(',');
                //     fullName.forEach(name => {
                //     let splitted = name.split(/v\.La Reine|v\. The Queen|v\.The Queen|v\. M.N.R|c\. M.N.R|v\. M.R.N.|c\. M.R.N.|v\. MNR|c\.  MNR|c\. La Reine|c\. The Queen/);
                //     firstName.push(splitted[0]);
                //     lastName.push(splitted[splitted.length-1]);
                //     });
                //     f_name_list = firstName.toString().split(", ");
                //     l_name_list = lastName.toString().split(", ");

                //     for (let i = 0; i < f_name_list.length; i++) {
                //         result.push({ 
                //           firstname: f_name_list[i],
                //           lastname: l_name_list[i]
                //         });
                //       }
                  
                //       //const filename = req.file.originalname;
                //       const itemsArray =result[0].firstname.split(',');
                      //console.log(itemsArray.toString());
                      
                
               

                //res.sendFile(__dirname +'/download.ejs');
                //res.status(200).write(cit[0].toString() + '\n');
                
         //res.status(200).write(cit[0].toString() + '\n');
         //res.sendFile(__dirname + '/download.html');
                // res.end();
       // res.status(200).send(cit.toString()+'\n');
            //console.log(jsonDataHandler);
            //res.status(200).send(jsonDataHandler.printSpecificItems());
        

    } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON.');
    }
    
    // You can render your results page here and pass any required data
    // Example: res.render('results', { data: resultsData });
    // Adjust this based on your actual results handling logic
    // You can also send a download link to the Excel file on this page
});




app.get('/download-excel', (req, res) => {
    // Generate the Excel file (similar to your existing code for generating the Excel file)
  
    // Set the appropriate headers for the response
    const excelFileName = req.query.excelFileName;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${excelFileName}"`);
  
    // Stream the Excel file to the client for download
    const fileStream = fs.createReadStream(excelFileName);
    fileStream.pipe(res);
  });
  
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
