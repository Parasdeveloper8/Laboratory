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
//Ids from myques.html
const quesList = document.getElementById("questions-list");
const loader = document.getElementById("r-loader");
if (loader)
    loader.style.display = 'block';
let page = 1;
let limit = 5;
let row = 0;
let isLoading = false; // To prevent multiple fetches at once
const fetchQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isLoading)
        return; // If the current fetch is still in progress, don't fetch again
    isLoading = true;
    try {
        const api = `http://localhost:4900/myques-data/${row}/${limit}`;
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
                        <div id="delete-${Id}" style="cursor:pointer;">🗑️</div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${Text}</h5>
                    <p class="card-text">category: ${Category}</p>
                </div>
                <button class="show-ans-btn" id="show-ans-btn-${shortenedUuid}">Show Answers</button>
            </div>

            <div id="ansBox-${shortenedUuid}" style="display:none;" class="ans-dialog">
                <button class="close" id="closeAnsBox-${shortenedUuid}">X</button>
                <div id="ans-loader-${shortenedUuid}" class="loader"></div>
                <!-- Container for dynamically rendered answers -->
                <div id="answers-container-${shortenedUuid}" class="answers-container"></div>
            </div>

        `;
        if (quesList)
            quesList.appendChild(questionCard); // Append the newly created card
        // Bind event listeners for the dynamically created buttons
        const ansBox = document.getElementById(`show-ans-btn-${shortenedUuid}`);
        if (ansBox)
            ansBox.addEventListener("click", () => openShowAnsBox(shortenedUuid, Text));
        const closeAnsBtn2 = document.getElementById(`closeAnsBox-${shortenedUuid}`);
        if (closeAnsBtn2)
            closeAnsBtn2.addEventListener('click', () => closeAnsBox(shortenedUuid));
        const deleteBtn = document.getElementById(`delete-${Id}`);
        if (!deleteBtn)
            return;
        // Delete button click event
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click event from bubbling up
            showDeleteConfirmation(Id); // Show the confirmation dialog
        });
    });
};
fetchQuestions();
// Close Answers Box
const closeAnsBox = (id) => {
    document.title = "Ques & Ans";
    const ansBox = document.getElementById(`ansBox-${id}`);
    if (ansBox)
        ansBox.style.display = 'none';
};
// Open Answers box
const openShowAnsBox = (id, ques) => __awaiter(void 0, void 0, void 0, function* () {
    const ansLoader = document.getElementById(`ans-loader-${id}`);
    if (ansLoader)
        ansLoader.style.display = 'block';
    try {
        const ansBox = document.getElementById(`ansBox-${id}`);
        // Clear the previous answers container before rendering
        const answersContainer = document.getElementById(`answers-container-${id}`);
        if (answersContainer)
            answersContainer.innerHTML = ''; // Clear any previous content
        if (ansBox)
            ansBox.style.display = 'block';
        const response = yield fetch(`http://localhost:4900/answers/${id}`);
        const data = yield response.json();
        const response2 = yield fetch(`http://localhost:4900/likenums`);
        const data2 = yield response2.json();
        if (ansLoader)
            ansLoader.style.display = 'none';
        renderAnswers(data.data, id, ques, data2.data); // Render new answers
        // Ensure layout and scrollbar behavior is correct after rendering answers
        setTimeout(() => {
            // Force a reflow to reset the overflow and ensure scrollbar visibility
            document.body.style.overflowY = 'auto';
        }, 100);
    }
    catch (error) {
        console.error("Error fetching answers", error);
        if (ansLoader)
            ansLoader.style.display = 'block';
    }
});
//render answers
const renderAnswers = (data1, id, ques, data2) => {
    const answersContainer = document.getElementById(`answers-container-${id}`);
    if (!answersContainer)
        return;
    answersContainer.style.maxHeight = '380px';
    answersContainer.style.overflowY = 'auto';
    // Map the likes data by Ans_id for easier access 
    const likesMap = data2.reduce((acc, item) => {
        acc[item.Ans_id] = item.Likes_Number; // Store likes by Ans_id
        return acc;
    }, {});
    // Iterate over answers and render them
    data1.forEach((ans) => {
        const { Answer, Username, Ans_id } = ans;
        // Create a new div for the answer
        const anss = document.createElement("div");
        // Get the like count for the current answer, default to 0 if not found
        const likeCount = likesMap[Ans_id] || 0;
        document.title = ques;
        // Insert the answer and like information into the HTML
        anss.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <strong>${Username}</strong>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Answer</h5>
                    <p class="card-text">${Answer}</p>
                    <br>
                    <div class="lk-div">
                        <button class="like-btn" id="ans-id-${Ans_id}">
                            <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                        </button>
                        <p class="like-count" id="like-count-${Ans_id}">${likeCount}</p>
                    </div>
                </div>
            </div>
        `;
        // Append the answer card to the answers container
        answersContainer.appendChild(anss);
    });
};
// Function to delete the question
function deleteQuestion(uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(uuid);
            const response = yield fetch(`http://localhost:4900/delete-que/${uuid}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Reload questions on successful deletion after delay of 3 secs
            setTimeout(() => location.reload(), 3000);
        }
        catch (error) {
            console.error("Error deleting question:", error);
        }
    });
}
// Function to show delete confirmation modal
function showDeleteConfirmation(uuid) {
    const modal = document.createElement("div");
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;";
    const confirmationBox = document.createElement("div");
    confirmationBox.style.cssText = "background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; width: 300px;";
    const message = document.createElement("p");
    message.textContent = "Are you sure you want to delete this Question?";
    message.style.cssText = "font-size: 16px; color: #333; margin-bottom: 20px;";
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = "display: flex; justify-content: space-around;";
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = "background-color: #ccc; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    cancelButton.addEventListener("click", () => modal.remove());
    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.cssText = "background-color: #ff5f5f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    okButton.addEventListener("click", () => {
        deleteQuestion(uuid);
        modal.remove();
    });
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);
    confirmationBox.appendChild(message);
    confirmationBox.appendChild(buttonContainer);
    modal.appendChild(confirmationBox);
    document.body.appendChild(modal);
}
scrollFetch(fetchQuestions);
