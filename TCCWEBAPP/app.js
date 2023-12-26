const express = require('express');
const multer = require('multer');
const fs = require('fs');
const JsonDataHandler = require('./jsonModel');
const makeApiRequests = require('./Api/requestApi.js');
const compareInitials = require('./compareIntials.js');
const getExcelFunc = require('./excel.js');
const app = express();
const port = 3000;
const ejs = require('ejs');
const { match } = require('assert');

const summarizeText = require('./summaryFunc');
const countTokens = require('./Api/gptModel.js');
let uploadedFile;
let storedData;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Set up multer for file uploads
const storage = multer.memoryStorage(); // You can also use 'diskStorage' for saving to disk
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        const allowed = file.mimetype === 'application/json';
        callback(null, allowed);
    }
});
// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});
app.use('/images', express.static('images'));
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
app.get('/results', async (req, res) => {
    if (!uploadedFile) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const all_data = JSON.parse(uploadedFile.buffer.toString());
        console.log(uploadedFile.originalname);
            const jsonDataHandler = new JsonDataHandler(all_data);
                let ResponseFromAi=[];
               let un_officialData=jsonDataHandler.printSpecificItems();
                let urlForCase=jsonDataHandler.printSpecificNames(); 
               let cit=[];
               let json =[];
               let url =[];

                    for(let i=0;i<361;i++){
                        cit.push(un_officialData[i]);
                        json.push(all_data[i]);
                        url.push(urlForCase[i]);
                        }
            
                    
                        // cit.push(un_officialData[41]);
                        // json.push(all_data[41]);
                        // url.push(urlForCase[41]);
                
                //     summarizeText(cit[0])
                //    .then((summary) => console.log(summary))
                //    .catch((error) => console.error('Error:', error));
                const InitalofAp =[];
                const InitialofJud = [];
                const typeOfIssue =[];
                const GenderofAppellant=[];
                const GenderofJudge=[];
                const outComeOfCase=[];
                const yeartheCasetook=[];
                const typeofTaxPayer=[];
                const url_case=[];

                url.forEach((item)=>{
                    url_case.push(item);
                })
                

                // const Limitarray =[]; 
                // function countTokenAmount(text) {
                //     const tokens_per_word = 1.3;
                //     let word_count = 0;
                  
                //     // Check if text is a string or an array of words
                //     if (typeof text === 'string') {
                //       // Split the string into words
                //       word_count = text.split(/\s+/).length;
                //     } else if (Array.isArray(text)) {
                //       // Use the length of the array as the word count
                //       word_count = text.length;
                //     }
                  
                //     const estimated_tokens = word_count * tokens_per_word;
                //     return estimated_tokens;
                //   }
                //     json.forEach((text,index)=>{                        
                //             if (text.unofficial_text && text.unofficial_text[index] !== undefined) {
                //                 let res = countTokenAmount(text.unofficial_text);
                //                 if (res < 40000) {
                //                     return Limitarray.push("Less than Limit");
                //                   } else {
                //                     return Limitarray.push("More than Limit");
                //                   }                
                //                 }else {
                //                     // Handle the case when unofficial_text or its index is undefined
                //                     console.error(`unofficial_text[${index}] is undefined for item:`, text.unofficial_text);
                //                 }
                //         });
                    
                        

                  //let jsonArray = 
        

                    let jsonArray = await makeApiRequests(cit);

                     for (const jsonObject of jsonArray) {
                        // Access the values using the keys
                        const outcome = jsonObject["Outcome of the Case"];
                        const caseDuration = jsonObject["How many years did the case take"];
                        const appellantGender = jsonObject["Gender of the Appellant"];
                        const judgeGender = jsonObject["Gender of the Judge"];
                        const issueType = jsonObject["Type of issue"];
                        const taxpayerType = jsonObject["Type of taxpayer"];
                        const InitialOfAppellant = jsonObject["Initials of the Appellant"];
                        const InitialOfJudge = jsonObject["Initials of the Judge"];

                        console.log("Outcome:", outcome);
                        console.log("Case Duration:", caseDuration);
                        console.log("Appellant Gender:", appellantGender);
                        console.log("Judge Gender:", judgeGender);
                        console.log("Issue Type:", issueType);
                        console.log("Taxpayer Type:", taxpayerType);
                        console.log("Initial of Appelant:", InitialOfAppellant);
                        console.log("Initial of Judge:", InitialOfJudge)


                        outComeOfCase.push(outcome);
                        yeartheCasetook.push(caseDuration);
                        GenderofAppellant.push(appellantGender);
                        GenderofJudge.push(judgeGender);
                        typeOfIssue.push(issueType);
                        typeofTaxPayer.push(taxpayerType);
                        InitalofAp.push(InitialOfAppellant);
                        InitialofJud.push(InitialOfJudge);


                    }
                    console.log(ResponseFromAi);
                    ResponseFromAi = [...ResponseFromAi, ...jsonArray];
                // If you want to log or do something with ResponseFromAi
               

                    //    console.log(ResponseFromAi[0]);
                    


                       
                
                // const promises = [ 
                    
                //     .then(response => {
                //        ResponseFromAi.push(response.toString());
                //       console.log('Result:', response);
                //     })
                //     .catch(err => {
                //       console.error('Error:', err);
                //     }),
                //      ];
                let TestFirstName=jsonDataHandler.printSpecificItems();
                let JudgeNames = jsonDataHandler.printSpecificItems();
                    const extractedStrings = [];
                    const appeleantnames =[];
                    const yearOfCase =[];
                    const Judgnames = [];
                    const Intials =[];
                    const pattern = /BETWEEN:\s*\n(.+?),/;
                    const patternTEST = /BETWEEN:\s*\n(.*?)\n/;
                    //const patternTEST = /BETWEEN:\s*\n([^,]+)/;
                    //const patternFrench =/ENTRE\s*:\s*\n(.+?),/;
                    const corporationPattern = /(?:\b|[^A-Za-z])(?:Inc\.|INC\.|Corp\.|Ltd\.|LTD\.|LLC)\.?/i;
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
                                }
                                else{
                                    extractedStrings.push(match[1]);
                                }
                            }else{
                                extractedStrings.push("Not Found");
                            }
                            // else{
                            //     //console.log(text.name.toString());
                            // }
                       });

                       let consecutiveNotFoundCount = 0;
                        let lastItemLengthWithAName = 0;

                        // Iterate through the array
                        for (let i = 0; i < extractedStrings.length; i++) {
                        if (extractedStrings[i].includes("Not Found")) {
                            // If "Not Found" is encountered, increment the count
                            consecutiveNotFoundCount++;
                        }
                        else {
                            // If a name is encountered, reset the count and store the length
                            consecutiveNotFoundCount = 0;
                            lastItemLengthWithAName++;
                        }

                        // Check if more than 10 consecutive "Not Found" items
                        if (consecutiveNotFoundCount > 10) {
                            break;  // Exit the loop if the condition is met
                        }
                        }
                        //console.log(lastItemLengthWithAName);
                    
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
                                        Judgnames.push("JudgeName Not Found in Pattern also ")
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
                                        Judgnames.push(mat[2].toString().substring(0,38))
                                    }else{
                                         Judgnames.push("JudgeName Not Found in Pattern also ")
                                    }
                                    //Judgnames.push("JudgeName Not Found in Pattern also ")
                                }
                                //Judgnames.push("JudgeName Not Found in Object")
                            }
                          
                          });
                          //console.log(extractedStrings.length.toString());
                          //console.log(corpnames.length);
                          //console.log(cit.length);
                          //console.log(Judgnames.length);  
                         
                            // console.log(extractedStrings[4]);
                            //     const isCorporation =corporationPattern.test(extractedStrings[4]);
                            //     let InputArray=[];
                            //     if(isCorporation){
                            //         InputArray.push(cit[4]+"list the shareholder name of this Corporation");
                            //     }
                                //const response =  await generateResponse(InputArray,);
                                //ResponseFromAi.push(response.toString());
                           // console.log(i);
                          

                        let i = 0;
                         for(i=0;i < InitalofAp.length && i < InitialofJud.length;i++){
                             if (InitalofAp[i] !== undefined && InitialofJud[i] !== undefined) {
                                try {
                                    const resultForIntials = compareInitials(InitalofAp[i].trim(), InitialofJud[i].trim());
                                    Intials.push(resultForIntials);
                                } catch (error) {
                                    Intials.push(0);
                                    console.error(`Error processing index ${i}: ${error.message}`);
                                    // Handle the error if needed
                                }
                             } else {
                                 Intials.push(0);
                                 // Handle the case where one of the arrays doesn't have a value at the current index
                                 console.log(`Skipping index ${i} due to missing values`);
                             }
                         }
                                    
                               
                            //  Promise.all(promises)
                            //     .then(
                            //         results => {
                            //             const excelFileName = getExcelFunc(Judgnames,yearOfCase,extractedStrings);
                            //             console.log(ResponseFromAi);
                            //             const temp = {extractedStrings,cit,JsonFilename:uploadedFile.originalname,Judgnames,yearOfCase,ResponseFromAi,excelFileName};
                            //             res.render('download',temp);
                                
                                         
                                 
                            //       // All promises have resolved, and results is an array of their resolved values
                            //       //console.log('All promises have resolved:', results);
                            //     })
                            //     .catch(error => {
                            //       // Handle any errors that occur during the promises
                            //       console.error('An error occurred:', error);
                            //     });
                                     
                                       
                                                              
                                     // console.log(Intials.toString());   

                                    
                                        const excelFileName = getExcelFunc(Judgnames, yearOfCase, extractedStrings, outComeOfCase, typeOfIssue, GenderofAppellant, GenderofJudge,Intials,yeartheCasetook,typeofTaxPayer,url_case,InitalofAp,InitialofJud);
                                        console.log(ResponseFromAi);
                                        storedData = {
                                            extractedStrings, cit, JsonFilename: uploadedFile.originalname, Judgnames, yearOfCase, ResponseFromAi, excelFileName,InitalofAp,InitialofJud, Intials, typeOfIssue, GenderofAppellant, GenderofJudge, outComeOfCase,yeartheCasetook,typeofTaxPayer
                                        };
                                        const temp = { extractedStrings, cit, JsonFilename: uploadedFile.originalname, Judgnames, yearOfCase, ResponseFromAi, excelFileName,InitalofAp,InitialofJud, Intials, typeOfIssue, GenderofAppellant, GenderofJudge, outComeOfCase,yeartheCasetook,typeofTaxPayer };
                                        res.redirect(`/download?data=${temp}`);
        

    } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON.');
    }
    
    // You can render your results page here and pass any required data
    // Example: res.render('results', { data: resultsData });
    // Adjust this based on your actual results handling logic
    // You can also send a download link to the Excel file on this page
});

app.get('/download', (req, res) => {
    data = storedData||{}
    // You can use storedData or temp, depending on your requirements
    res.render('download', data);
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
