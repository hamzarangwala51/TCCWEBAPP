const express = require('express');
const multer = require('multer');
const fs = require('fs');
const JsonDataHandler = require('./jsonModel');
const app = express();
const port = 3000;
const ejs = require('ejs');
const { match } = require('assert');

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
app.post('/upload', upload.single('jsonFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }


    // Convert the uploaded file buffer to a JSON object
    try {
        const json = JSON.parse(req.file.buffer.toString());
        console.log(req.file.originalname);
            const jsonDataHandler = new JsonDataHandler(json);
                let cit=jsonDataHandler.printSpecificItems();
                let TestFirstName=jsonDataHandler.printSpecificItems();
                let JudgeNames = jsonDataHandler.printSpecificItems();
                    const extractedStrings = [];
                    const appeleantnames =[];
                    const yearOfCase =[];
                    const Judgnames = [];
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
                          let JsonFilename = req.file.originalname;
                          
                      
                       
                     

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
                      const temp = {extractedStrings,cit,JsonFilename,Judgnames,yearOfCase};
                res.render('download',temp);

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
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
