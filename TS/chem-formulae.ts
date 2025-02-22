//Ids from chemical-formulae.html
const elem1:HTMLElement | null = document.getElementById("elem1");
const elem2:HTMLElement | null = document.getElementById("elem2");

const apiUrl:string = 'http://localhost:4900/SymbolValency';

async function createformula() {
    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        const result = data.data; // Access the "data" array from the response

        // Reference to the container where elements will be displayed
        const resultDiv:HTMLElement | null = document.getElementById("result-div");
        if(!resultDiv) return;

        // Clear the container before populating
        resultDiv.innerHTML = '';

        let resultsFound:boolean = false;
        let itsValency1,itsValency2,itsSymbol1,itsSymbol2;

        // Check if either elem1 or elem2 matches any element's name
        result.forEach((element:any) => {
            // Check if elem1 value matches the name in the API data
            if(!elem1) return;
            if ((elem1 as HTMLInputElement).value === element.name) {
                itsValency1 = element.valency;
                itsSymbol1 = element.symbol;
                resultsFound = true;
            }

            if(!elem2) return;
            // Check if elem2 value matches the name in the API data
            if ((elem2 as HTMLInputElement).value === element.name) {
                itsValency2 = element.valency;
                itsSymbol2 = element.symbol;
                resultsFound = true;
            }
        });

        // If both elem1 and elem2 have valid valency, display them
       // If both elem1 and elem2 have valid valency, display them
if (resultsFound) {
    let result;

    if (itsValency1 === 1 && itsValency2 === 1) {
        // Case where both valencies are 1
        result = `${itsSymbol1}${itsSymbol2}`;
    } 
    else if (itsValency1 === itsValency2) {
        // Case where both valencies are equal
        result = `${itsSymbol1}${itsSymbol2}`;
    }
    else if (itsValency2 === 1) {
        // Case where valency of elem2 is 1
        result = `${itsSymbol1}${itsSymbol2} ${itsValency1}`;
    }
    else if (itsValency1 === 1) {
        // Case where valency of elem1 is 1
        result = `${itsSymbol1} ${itsValency2}${itsSymbol2}`;
    } 
    else {
        // Case where neither valency is 1 and both are different
        result = `${itsSymbol1} ${itsValency2} ${itsSymbol2} ${itsValency1}`;
    }

    // Display the result
    resultDiv.innerHTML = `<p>${result}</p>`;
   } else {
    resultDiv.innerHTML = '<p>No matching elements found.</p>';
   }

    } catch (error) {
        console.error('Error fetching elements:', error);
        const resDiv:HTMLElement|null = document.getElementById('result-div');
        if(!resDiv) return;
        resDiv.innerHTML = '<p>Error loading elements data.</p>';
    }
}

const myform : HTMLElement | null = document.getElementById("myform");
if(myform){
myform.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting
});
}
// Call the function to fetch and display elements initially
createformula();

export{}