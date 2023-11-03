class JsonDataHandler {
    constructor(data) {
        this.data = data;
    }

    printSpecificItems(){
        const cits =[];
        for (const item of this.data) {
           // let cit = ("name",item.name);
             let cit = ("unofficail_text",item.unofficial_text);
               cits.push(cit);
            // console.log("Name:", item.name);
            // console.log("Year:", item.year);
            // // Add more properties as needed.
            // console.log(); // Add a line break for readability.
        }

        return cits;
   
    }
    printSpecificNames() {
        const cits =[];
        for (const item of this.data) {
            let cit = ("name",item.name);
           //  let cit = ("unofficail_text",item.unofficial_text);
                cits.push(cit);
            // console.log("Name:", item.name);
            // console.log("Year:", item.year);
            // // Add more properties as needed.
            // console.log(); // Add a line break for readability.
        }
        return cits;
   
    }
}
module.exports = JsonDataHandler; 
// Sample JSON data

// Create an instance of the JsonDataHandler class
//const jsonDataHandler = new JsonDataHandler(jsonData);

// Call the method to print specific items
//jsonDataHandler.printSpecificItems();
