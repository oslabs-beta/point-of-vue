const deepCopy = (input: any ): any => {
  //declare result
  let result: any;
  //if input is array set result to array
  //else if input is object set result to object
  //else return input
  if (Array.isArray(input)){
    result = [];
    //iterate over input
    //if current element has type of object push to result invocation of deepCopy with current element as its input
      //else push element to result   
    for (let i = 0; i < input.length; i++){
      result.push(typeof input[i] === 'object' ? deepCopy(input[i]) : input[i]);
    }  
  } else if (typeof input === 'object'){
    result = {};
    //iterate over input
    //if current key has type of object add invocation of deepCopy with current element as its input to result 
      //else add key/value to result
    for (let key in input){
      result[key] = typeof key === 'object' ? deepCopy(input[key]) : input[key];
    }   
  } else {
    return input;
  }  
  return result;        
}

export { deepCopy as default }