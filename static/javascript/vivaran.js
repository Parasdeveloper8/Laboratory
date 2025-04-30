var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//ids from shabdVivaran.html
const word = document.getElementById("s1");
const form = document.getElementById("form");
const submitBtn = document.getElementById("btn");
const resultBox = document.getElementById("resultContainer");
const API = "http://localhost:4900/sanskrit";
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => event === null || event === void 0 ? void 0 : event.preventDefault());
submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener("click", getDetail);
let found = false;
function getDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch data from the API 
            const response = yield fetch(API);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json(); // Parse JSON response
            const words = data.data;
            if (resultBox)
                resultBox.innerHTML = "";
            words.forEach((wrd) => {
                if (!word) {
                    console.log("Empty word value");
                    return;
                }
                ;
                if (word.value.trim().toLowerCase() === wrd.shabd.trim().toLowerCase()) {
                    if (resultBox)
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
            if (!found) {
                if (resultBox)
                    resultBox.innerHTML += "No data found with given word";
            }
        }
        catch (error) {
            found = false;
            console.error("Error", error);
            if (resultBox)
                resultBox.innerHTML = "<p><b>Failed to show details</b></p>";
        }
    });
}
export {};
