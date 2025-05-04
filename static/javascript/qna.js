var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { scrollFetch } from "./reusefuns.js";
import { search } from "./reusefuns.js";
//Ids from qna-page.html
const dialogBox = document.getElementById('dialogueBox');
const quesList = document.getElementById("questions-list");
const loader = document.getElementById("r-loader");
const searchValue = document.getElementById("search-value");
const quePen = document.getElementById("pen");
const closeDialogue = document.getElementById("closeDialog");
const addQuesForm = document.getElementById("addQues");
const textarea = document.getElementById('text');
if (addQuesForm) {
    addQuesForm.addEventListener("submit", (e) => e.preventDefault());
} //Add event listener to form to prevent reloading
function autoResizeTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener('input', () => autoResizeTextArea(textarea));
//Add event listener to form button to post question
document.addEventListener("DOMContentLoaded", () => {
    const addQuesBtn = document.getElementById("subBtn");
    if (addQuesBtn) {
        addQuesBtn.addEventListener("click", addQue);
    }
});
if (loader)
    loader.style.display = 'block';
let page = 1;
let limit = 5;
let row = 0;
let isLoading = false; // To prevent multiple fetches at once
// Open dialog box to put question
const openDialog = () => {
    if (dialogBox)
        dialogBox.style.display = 'block';
};
if (quePen)
    quePen.addEventListener("click", openDialog);
// Close dialog box to put question
const closeDialog = () => {
    if (dialogBox)
        dialogBox.style.display = 'none';
};
if (closeDialogue)
    closeDialogue.addEventListener("click", closeDialog);
//search question
function searchQuestion() {
    if (!searchValue)
        return;
    //convert HTMLElement to HTMLInputElement
    const searchVal = searchValue;
    const api = `http://localhost:4900/searchQues?val=${searchVal.value}`;
    search(quesList, api, "No related question found", renderQues);
}
// Add question
const addQue = () => __awaiter(void 0, void 0, void 0, function* () {
    const category = document.getElementById("select");
    const text = document.getElementById("text");
    //convert HTMLElement to HTMLInputElement
    const categoryValue = category.value;
    const textValue = text.value;
    const jsonData = {
        text: textValue,
        category: categoryValue
    };
    try {
        const api = `http://localhost:4900/post-ques`;
        const response = yield fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        });
        if (response.ok) {
            closeDialog();
            fetchQuestions(); // Refresh the questions after submitting
        }
    }
    catch (error) {
        console.error("Error on posting question", error);
    }
});
const fetchQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isLoading)
        return; // If the current fetch is still in progress, don't fetch again
    isLoading = true;
    try {
        const api = `http://localhost:4900/ques-data/${row}/${limit}`;
        const response = yield fetch(api);
        const data = yield response.json();
        // Check if there are no more questions to fetch
        if (data.data.length === 0) {
            if (loader)
                loader.style.display = 'none'; // Hide the loader
            return; // No more data, stop fetching
        }
        if (loader)
            loader.style.display = 'none'; // Hide the loader when new data is fetched
        row += limit; // Update the row to the next set of questions
        page++; // Update page number for pagination
        renderQues(data.data); // Render new questions
    }
    catch (error) {
        console.error("Error on fetching questions", error);
    }
    finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
});
// Render questions dynamically
const renderQues = (questionsToDisplay) => {
    questionsToDisplay.forEach((quest) => {
        const { Text, Username, Category, FormattedTime, Profile_Image, Id } = quest;
        const questionCard = document.createElement("div");
        questionCard.classList.add("col-12", "col-md-6", "mb-3"); // Use col-md-6 for 2 cards per row, col-12 for full width on small screens
        const shortenedUuid = Id.replace(/-/g, ''); // Remove hyphens
        questionCard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${Profile_Image ? `data:image/jpeg;base64,${Profile_Image}` : 'static/Images/avatar_face_only.png'}" alt="User Icon" style="width: 30px; height: 30px; margin-right: 8px;">
                            <strong>${Username}</strong>
                        </div>
                        <p class="text-muted">${FormattedTime}</p>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${Text}</h5>
                    <p class="card-text">category: ${Category}</p>
                </div>
                <button class="ans-btn" id="ans-btn-${shortenedUuid}">Add Answer</button>
                <button class="show-ans-btn" id="show-ans-btn-${shortenedUuid}">Show Answers</button>
            </div>

            <div id="ansBox-${shortenedUuid}" style="display:none;" class="ans-dialog">
                <button class="close" id="closeAnsBox-${shortenedUuid}">X</button>
                <div id="ans-loader-${shortenedUuid}" class="loader"></div>
                <!-- Container for dynamically rendered answers -->
                <div id="answers-container-${shortenedUuid}" class="answers-container"></div>
            </div>

            <div class="dialog" id="postAnsDia-${shortenedUuid}">
                <button class="close" id="close-ans-${shortenedUuid}">X</button>
                <form id="ans-form-${shortenedUuid}">
                    <textarea placeholder="Your Answer here" name="ans" id="answerText-${shortenedUuid}" class="text" required></textarea>
                    <br>
                    <button type="submit" class="sub-btn">Post Answer</button>
                </form>
            </div>
        `;
        if (!quesList)
            return;
        quesList.appendChild(questionCard); // Append the newly created card
        // Bind event listeners for the dynamically created buttons
        const ansBtn = document.getElementById(`ans-btn-${shortenedUuid}`);
        if (ansBtn)
            ansBtn.addEventListener("click", () => openPostAnsBox(shortenedUuid));
        const textarea2 = document.getElementById(`answerText-${shortenedUuid}`);
        if (textarea2)
            textarea2.addEventListener('input', () => autoResizeTextArea(textarea2));
        const closeAnsBtn = document.getElementById(`close-ans-${shortenedUuid}`);
        if (closeAnsBtn)
            closeAnsBtn.addEventListener("click", () => closePostAnsBox(shortenedUuid));
        const ansForm = document.getElementById(`ans-form-${shortenedUuid}`);
        if (ansForm)
            ansForm.addEventListener("submit", (event) => subAns(event, shortenedUuid));
        const ansBox = document.getElementById(`show-ans-btn-${shortenedUuid}`);
        if (ansBox)
            ansBox.addEventListener("click", () => window.location.href = `/answersPage/${Text}/${shortenedUuid}`);
        const closeAnsBtn2 = document.getElementById(`closeAnsBox-${shortenedUuid}`);
        if (closeAnsBtn2)
            closeAnsBtn2.addEventListener('click', () => closeAnsBox(shortenedUuid));
    });
};
fetchQuestions();
// Open post answer dialogue box
const openPostAnsBox = (id) => {
    const postAnsDialogueBox = document.getElementById(`postAnsDia-${id}`);
    if (postAnsDialogueBox)
        postAnsDialogueBox.style.display = 'block';
};
// Close post answer dialogue box
const closePostAnsBox = (id) => {
    const postAnsDialogueBox = document.getElementById(`postAnsDia-${id}`);
    if (postAnsDialogueBox)
        postAnsDialogueBox.style.display = 'none';
};
// Submit Answer
const subAns = (event, id) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    try {
        const answerText = document.getElementById(`answerText-${id}`);
        const ansTextValue = answerText.value;
        const api = `http://localhost:4900/post-ans`;
        const jsonData = {
            id: id,
            answer: ansTextValue
        };
        const response = yield fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        });
        if (response.ok) {
            closePostAnsBox(id);
        }
    }
    catch (error) {
        console.error("Error on posting Answers", error);
    }
});
// Close Answers Box
const closeAnsBox = (id) => {
    document.title = "Ques & Ans";
    const ansBox = document.getElementById(`ansBox-${id}`);
    if (!ansBox)
        return;
    ansBox.style.display = 'none';
};
const searchBar = document.getElementById("search-bar");
if (searchBar)
    searchBar.addEventListener("submit", (e) => e.preventDefault());
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchQuestion);
    }
});
// Scroll to load more questions
scrollFetch(fetchQuestions);
