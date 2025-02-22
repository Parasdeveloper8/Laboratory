//Ids from gravitational-page.html
const resultContainer:HTMLElement | null = document.getElementById("result-container");
const step1:HTMLElement | null = document.getElementById("step-1");
const step2:HTMLElement | null = document.getElementById("step-2");
const massOne:HTMLElement | null = document.getElementById("m-1");
const massTwo:HTMLElement | null = document.getElementById("m-2");
const constant:number = 6.67 * Math.pow(10,-11);
const distance:HTMLElement | null = document.getElementById("r");

const calcGravitationalForce=(event:any):number | void=>{
    event.preventDefault();
    if(!massOne)return;
    if(!massTwo)return;
    if(!step1)return;
    if(!step2)return;
    if(!resultContainer)return;
    if(!distance)return;
    
    const massOneValue = (massOne as HTMLInputElement).value;
    //convert massOneValue to number for further use
    const numMassOne:number = Number(massOneValue);

    const massTwoValue = (massTwo as HTMLInputElement).value;
    //convert massTwoValue to number for further use
    const numMassTwo:number = Number(massTwoValue);

    const distanceValue = (distance as HTMLInputElement).value;
    //convert distanceValue to number
    const numDistance = Number(distanceValue);

    const stepFormula1 = (constant * numMassOne * numMassTwo);

    const formula = (constant * numMassOne * numMassTwo) / ( numDistance ** 2);
     step1.innerHTML=`<p>G x M1 x M2 = ${stepFormula1}</p>`;
     step2.innerHTML=`<p>G x M1 x M2 / r^2 = ${formula}</p>`;
     resultContainer.innerHTML = `<p>Force = ${formula} Newton</p>`;
    
    return formula
}

export{}