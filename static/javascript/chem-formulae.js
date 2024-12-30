const API = "http:localhost:4900/SymbolValency";

const elem1= document.getElementById("elem1");
const elem2= document.getElementById("elem2");

const p1 = document.createElement("p");
const p2 = document.createElement("p");
const p3 = document.createElement("p");
const p4 = document.createElement("p");


const createformula = (event)=>{
    event.preventDefault();
    if(val1 && val2 == 1){
         p2.style.visibility = "hidden";
         p4.style.visibility = "hidden";
    }

    p1.innerText = elem1;
    p2.innerText = val2;
    p3.innerText = elem2;
    p4.innerText =val1;
}