function findConsecutiveNotFoundIndex(arr) {
    let consecutiveCount = 0;
    let consecutiveStartIndex = -1;
  
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "Not Found") {
        consecutiveCount++;
  
        if (consecutiveCount === 1) {
          consecutiveStartIndex = i;
        }
  
        if (consecutiveCount > 10) {
          // Found more than 10 consecutive occurrences
          return consecutiveStartIndex - 1;
        }
      } else {
        // Reset consecutive count if a different value is encountered
        consecutiveCount = 0;
      }
    }
  
    // If no match found, return -1 or handle as needed
    return -1;
  }
  
  // Example usage:
  const myArray = ["Not found", "Not found", "Not found", "Value", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found", "Not found"];
  
 module.exports = findConsecutiveNotFoundIndex;
  