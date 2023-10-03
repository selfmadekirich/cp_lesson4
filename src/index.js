import {MiniMaple} from "../src/miniMaple";
import { InvalidOperationError } from "../src/Errors/CustomErrors";
import { InvalidArgumentError } from "../src/Errors/CustomErrors";

document.addEventListener('DOMContentLoaded',setup)

function setup() {
    document.getElementById('demoButton').onclick = CalculateDerivative;
}

function Validate(params){
    
    for(const param of params){
        if(!param){
            alert("All fields must be filled")
        }
    }
}
 
function CalculateDerivative(){
    const input_formula = document.getElementById('input_formula').value;
    const input_var = document.getElementById('input_var').value;
    const Result = document.getElementById('Result');
    Validate([input_formula,input_var])
    try{
        const mm = new MiniMaple().diff(input_formula,input_var)
        Result.innerHTML= "Result:" + mm
    }
    catch(e){
        alert(e)
    }

}