const express = require('express');
const multer = require('multer');
const fs = require('fs');
const JsonDataHandler = require('./jsonModel');
const app = express();
const port = 3000;

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

// Handle file upload
app.post('/upload', upload.single('jsonFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Convert the uploaded file buffer to a JSON object
    try {
        const json = JSON.parse(req.file.buffer.toString());
        //console.log('Uploaded JSON:',json);
        //res.send('File uploaded and parsed successfully.');
        const jsonDataHandler = new JsonDataHandler(json);
         let cit=jsonDataHandler.printSpecificItems();

         res.status(200).write(cit[0].toString() + '\n');
         res.end();
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
