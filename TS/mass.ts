//id from atomicMasspage.html
const input:HTMLElement|null = document.getElementById("input");

const apiUrl : string = 'http://localhost:4900/atomic-mass';

async function fetchAndDisplayElements() {
    try {
        // Fetch data from the API 
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        const elements = data.data; // Access the "data" array from the response

        // Reference to the container where elements will be displayed
        const massDiv:HTMLElement|null = document.getElementById("mass-div");
        if(!massDiv) return;
        // Clear the container before populating
        massDiv.innerHTML = '';
        elements.forEach((element:any) => {
            if(!input) return;
            if ((input as HTMLInputElement).value === element.name || (input as HTMLInputElement).value === element.symbol){
            const elementDiv:HTMLDivElement = document.createElement('div');
            elementDiv.className = 'element';

            // Populate the element div with name, mass, and symbol
            elementDiv.innerHTML = `
                <h3>${element.name} (${element.symbol})</h3>
                <p>Atomic Mass: ${element.atomic_mass}</p>
            `;

            // Append the element div to the container
            massDiv.appendChild(elementDiv);
            }
        });
    } catch (error) {
        console.error('Error fetching elements:', error);
        const _massDiv:HTMLElement|null = document.getElementById('mass-div');
        if(!_massDiv) return;
        _massDiv.innerHTML = '<p>Error loading elements data.</p>';
    }
}
const myform :HTMLElement | null = document.getElementById("myform");
if(myform){
myform.addEventListener("submit",function(event){
       event.preventDefault();
});
}

const getMass = fetchAndDisplayElements;
/*window.onload = fetchAndDisplayElements;*/
export {}