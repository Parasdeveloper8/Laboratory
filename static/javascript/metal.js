const input = document.getElementById("input");

const apiUrl = 'http://localhost:4900/metal-or-not';

async function fetchAndDisplayElements() {
    try {
        // Fetch data from the API 
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        const result = data.data; // Access the "data" array from the response

        // Reference to the container where elements will be displayed
        const resultDiv = document.getElementById("result-div");

        // Clear the container before populating
        resultDiv.innerHTML = '';
        result.forEach((results) => {
            if (input.value === results.name || input.value === results.symbol){
            const anotherDiv = document.createElement('div');
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
        document.getElementById('result-div').innerHTML = '<p>Error loading elements data.</p>';
    }
}
const myform = document.getElementById("myform");
myform.addEventListener("submit",function(event){
    event.preventDefault();
});

const getMass = fetchAndDisplayElements;
/*window.onload = fetchAndDisplayElements;*/