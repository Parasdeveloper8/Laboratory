//Ids from gravitational-page.html
const resultContainer = document.getElementById("result-container");
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const massOne = document.getElementById("m-1");
const massTwo = document.getElementById("m-2");
const constant = 6.67 * Math.pow(10, -11);
const distance = document.getElementById("r");
const calcGravitationalForce = (event) => {
    event.preventDefault();
    if (!massOne)
        return;
    if (!massTwo)
        return;
    if (!step1)
        return;
    if (!step2)
        return;
    if (!resultContainer)
        return;
    if (!distance)
        return;
    const massOneValue = massOne.value;
    //convert massOneValue to number for further use
    const numMassOne = Number(massOneValue);
    const massTwoValue = massTwo.value;
    //convert massTwoValue to number for further use
    const numMassTwo = Number(massTwoValue);
    const distanceValue = distance.value;
    //convert distanceValue to number
    const numDistance = Number(distanceValue);
    const stepFormula1 = (constant * numMassOne * numMassTwo);
    const formula = (constant * numMassOne * numMassTwo) / (numDistance ** 2);
    step1.innerHTML = `<p>G x M1 x M2 = ${stepFormula1}</p>`;
    step2.innerHTML = `<p>G x M1 x M2 / r^2 = ${formula}</p>`;
    resultContainer.innerHTML = `<p>Force = ${formula} Newton</p>`;
    return formula;
};

