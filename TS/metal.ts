//Our input element in metalNon.html
const input = document.getElementById("input") as HTMLInputElement | null;

//API url
const apiUrl: string = 'http://localhost:4900/metal-or-not';

//Function to display elements
async function fetchAndDisplayElements() {
    try {
        // Fetch data from the API 
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        const result : any[]= data.data; // Access the "data" array from the response

        // Reference to the container where elements will be displayed
        const resultDiv:HTMLElement | null = document.getElementById("result-div");

        if(!resultDiv) return ;
        // Clear the container before populating
        resultDiv.innerHTML = '';

        result.forEach((results) => {
            if(!input) return;
            if (input?.value === results.name || input.value === results.symbol){
            const anotherDiv:HTMLDivElement = document.createElement('div');
            anotherDiv.className = 'res';

            // Populate the element div with name, mass, and symbol
            anotherDiv.innerHTML = `
                <h3>${results.name} (${results.symbol})</h3>
                <p>Category: ${results.category}</p>
            `;

            // Append the element div to the container
            resultDiv.appendChild(anotherDiv);
            }
        });
    } catch (error) {
        console.error('Error fetching elements:', error);
        let resultDiv = document.getElementById('result-div');
        if(!resultDiv) return;
        resultDiv.innerHTML = '<p>Error loading elements data.</p>';
    }
}
const myform : HTMLElement | null= document.getElementById("myform");

if(myform){
myform.addEventListener("submit",function(event){
    event.preventDefault();
});
}

const getMass = fetchAndDisplayElements;
/*window.onload = fetchAndDisplayElements;*/
export {}