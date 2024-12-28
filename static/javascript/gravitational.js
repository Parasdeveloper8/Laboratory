
const resultContainer = document.getElementById("result-container");
const step1=document.getElementById("step-1");
const step2=document.getElementById("step-2");
const massOne =  document.getElementById("m-1");
const massTwo =  document.getElementById("m-2");
const constant = 6.67 * Math.pow(10,-11);
const distance = document.getElementById("r");
const calcGravitationalForce=(event)=>{
    event.preventDefault();
    const stepFormula1 = (constant * massOne.value * massTwo.value);
    const formula = (constant * massOne.value * massTwo.value) / (distance.value ** 2);
    step1.innerHTML=`<p>G x M1 x M2 = ${stepFormula1}</p>`;
    step2.innerHTML=`<p>G x M1 x M2 / r^2 = ${formula}</p>`;
    resultContainer.innerHTML = `<p>Force = ${formula} Newton</p>`;
    return formula
}