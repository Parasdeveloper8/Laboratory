"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Our input element in metalNon.html
const input = document.getElementById("input");
//API url
const apiUrl = 'http://localhost:4900/metal-or-not';
//Function to display elements
function fetchAndDisplayElements() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch data from the API 
            const response = yield fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json(); // Parse JSON response
            const result = data.data; // Access the "data" array from the response
            // Reference to the container where elements will be displayed
            const resultDiv = document.getElementById("result-div");
            if (!resultDiv)
                return;
            // Clear the container before populating
            resultDiv.innerHTML = '';
            result.forEach((results) => {
                if (!input)
                    return;
                if ((input === null || input === void 0 ? void 0 : input.value) === results.name || input.value === results.symbol) {
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
        }
        catch (error) {
            console.error('Error fetching elements:', error);
            let resultDiv = document.getElementById('result-div');
            if (!resultDiv)
                return;
            resultDiv.innerHTML = '<p>Error loading elements data.</p>';
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
