export default (strings, ...values) => {   
    //build one string from strings and values
    let output = '';
    for (let i = 0; i < values.length; i++) {
      output += strings[i] + values[i];
    }
    output += strings[values.length];
  
    //split on newlines
    let lines = output.split(/(?:\r\n|\n|\r)/);
  
    //remove whitespace
    return lines.map((line) => {
      return line.trim();
    }).join('').trim();
  }