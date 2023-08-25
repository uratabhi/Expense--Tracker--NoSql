
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const btnElement = document.querySelector('button')!;

type numOrstring = number | string;

function add(num1: numOrstring, num2: numOrstring){
     if(typeof num1 === 'string' && typeof num2 === 'string'){
        return num1 + ' ' + num2;
     }
     else if(typeof num1 === 'number' && typeof num2 === 'number'){
         return num1+num2;
     }
     
         return +num1 + +num2;
     
}

const numResults :  number[] = [];
const stringResults :  string[] = [];

function printResult(resultObj : {val : number; timestamp : Date}){
     console.log(resultObj.val);
}


btnElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    const stringresult = add(num1, num2);
    numResults.push(result as number);
    stringResults.push(stringresult as string);
    printResult({val : result as number, timestamp: new Date()});
    console.log(numResults, stringResults);
    
});
