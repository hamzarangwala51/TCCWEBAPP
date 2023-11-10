function compareInitials(taxpayerName,judgeName) {
    console.log(taxpayerName);
    const taxPayerName = taxpayerName.toString().split(' ');
    const taxpayerInitials = {
      first: taxPayerName[0][0],
      last: taxPayerName[taxPayerName.length-1][0],
    };
    console.log(judgeName);
    if(!judgeName.includes("JudgeName Not Found in Pattern also")){
    const JudgeNames = judgeName.toString().split(' ');
    let judgeInitials = null;
    if(JudgeNames.length<=2){
         judgeInitials = {
      first: JudgeNames[0][0],
      last: JudgeNames[JudgeNames.length-1][0],
    };
    }else if(JudgeNames.length>=3){
        judgeInitials = {
            first: JudgeNames[2][0],
            last: JudgeNames[JudgeNames.length-1][0],
          };
    }

  
    console.log(taxpayerInitials.first);
    console.log(taxpayerInitials.last);
    console.log(judgeInitials.first);
    console.log(judgeInitials.last);

    if (
      taxpayerInitials.first === judgeInitials.first &&
      taxpayerInitials.last === judgeInitials.last
    ) {
      return 1;
    } else if (taxpayerInitials.first === judgeInitials.first) {
      return 2;
    } else if (taxpayerInitials.last === judgeInitials.last) {
      return 3;
    } else if (taxpayerInitials.first === judgeInitials.last) {
      return 4;
    } else if (taxpayerInitials.last === judgeInitials.first) {
      return 5;
    } else {
      return 6;
    }
  }else{
    return "No Comparison Made";
  }
}
  
  // Example usage:
 // const taxpayerName = "JF";
 // const judgeName = "JF";
  
  //const result = compareInitials(taxpayerName, judgeName);
  //console.log(`Comparison Result: ${result}`);

  module.exports = compareInitials;
  