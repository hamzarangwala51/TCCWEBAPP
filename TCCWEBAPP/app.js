const express = require('express');
const multer = require('multer');
const fs = require('fs');
const JsonDataHandler = require('./jsonModel');
const app = express();
const port = 3000;
const ejs = require('ejs');

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
                let tempName=jsonDataHandler.printSpecificNames();
                let TestFirstName=jsonDataHandler.printSpecificItems();
                    const extractedStrings = [];
                    const pattern = /BETWEEN:\s*\n(.+?),/;
                        // Extract the text property from the object

                        // Use regular expressions to find and store matching strings in the array
                       // const matches = TestFirstName[0].match(pattern);
                        TestFirstName.forEach((text) => {
                            const match = text.match(pattern);
                            if (match) {
                              extractedStrings.push(match[1]);
                            }
                          });
                          let JsonFilename = req.file.originalname;
                          
                       console.log(extractedStrings.length.toString());
                       
                

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
                      const temp = {extractedStrings,cit,JsonFilename};
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
