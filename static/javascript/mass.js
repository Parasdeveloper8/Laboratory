
const input = document.getElementById("input");

const apiUrl = 'http://localhost:4901/atomic-mass';

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
        const massDiv = document.getElementById("mass-div");

        // Clear the container before populating
        massDiv.innerHTML = '';
        elements.forEach((element) => {
            if (input.value === element.name || input.value === element.symbol){
            const elementDiv = document.createElement('div');
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
        document.getElementById('mass-div').innerHTML = '<p>Error loading elements data.</p>';
    }
}
const myform = document.getElementById("myform");
myform.addEventListener("submit",function(event){
    event.preventDefault();
});

const getMass = fetchAndDisplayElements;
/*window.onload = fetchAndDisplayElements;*/