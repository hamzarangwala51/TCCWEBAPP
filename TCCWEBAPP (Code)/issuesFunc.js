function checkForIssues(input) {
    // Convert the input string to lowercase for case-insensitive comparison
    const lowercasedInput = input.toString().toLowerCase();
  
    // Use a regular expression to find all occurrences of the word "issues"
    const matches = lowercasedInput.match(/\bissues\b/g);
  
    // If matches is null or its length is greater than 1, return 1, else return 0
    return matches && matches.length > 1 ? 1 : 0;
  }

  module.exports = checkForIssues;