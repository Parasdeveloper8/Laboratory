//ids from shabdVivaran.html
const word:HTMLElement | null = document.getElementById("s1"); 
const form:HTMLElement | null = document.getElementById("form");
const submitBtn : HTMLElement | null =document.getElementById("btn");
const resultBox : HTMLElement | null = document.getElementById("resultContainer");

const API : string = "http://localhost:4900/sanskrit";
form?.addEventListener("submit",(event)=>event?.preventDefault());

submitBtn?.addEventListener("click",getDetail);

let found = false;
async function getDetail(){
    try{
         // Fetch data from the API 
         const response = await fetch(API);

         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const data = await response.json(); // Parse JSON response
         const words = data.data;
         if(resultBox) resultBox.innerHTML = "";
        
         words.forEach((wrd:any)=> {
            if(!word){
                console.log("Empty word value");
                return;
            };
            if((word as HTMLInputElement).value.trim().toLowerCase() === wrd.shabd.trim().toLowerCase()){
                    if(resultBox)
                    resultBox.innerHTML += `
                    <h4>शब्द : ${wrd.shabd}</h4>
                    <p>अर्थ : ${wrd.arth}</p>
                    <p>वचन : ${wrd.vachan}</p>
                    <p>विभक्ति : ${wrd.vibhakti}</p>
                    <p>लिंग : ${wrd.ling}</p>
                    <p>कारक : ${wrd.karak}</p>
                `;
                   found = true;
            }
         });
         if(!found){
            if(resultBox) resultBox.innerHTML += "No data found with given word";
         }
    }catch(error){
        found = false;
        console.error("Error",error);
        if(resultBox)
        resultBox.innerHTML = "<p><b>Failed to show details</b></p>";
    }
}

export {}