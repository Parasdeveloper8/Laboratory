var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//id from atomicMasspage.html
const input = document.getElementById("input");
const apiUrl = 'http://localhost:4900/atomic-mass';
function fetchAndDisplayElements() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch data from the API 
            const response = yield fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json(); // Parse JSON response
            const elements = data.data; // Access the "data" array from the response
            // Reference to the container where elements will be displayed
            const massDiv = document.getElementById("mass-div");
            if (!massDiv)
                return;
            // Clear the container before populating
            massDiv.innerHTML = '';
            elements.forEach((element) => {
                if (!input)
                    return;
                if (input.value === element.name || input.value === element.symbol) {
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
        }
        catch (error) {
            console.error('Error fetching elements:', error);
            const _massDiv = document.getElementById('mass-div');
            if (!_massDiv)
                return;
            _massDiv.innerHTML = '<p>Error loading elements data.</p>';
        }
    });
}
const myform = document.getElementById("myform");
if (myform) {
    myform.addEventListener("submit", function (event) {
        event.preventDefault();
    });
}
const getMass = fetchAndDisplayElements;