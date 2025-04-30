var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//id from ansPage.html
const cenDiv = document.getElementById("central-cont");
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathParts = window.location.pathname.split("/");
        const queId = pathParts[2];
        const response = yield fetch(`http://localhost:4900/answers/${queId}`);
        const data = yield response.json();
        const response2 = yield fetch(`http://localhost:4900/likenums`);
        const data2 = yield response2.json();
        renderAnswers(data.data, data2.data); // Render new answers
    }
    catch (error) {
        console.log("Failed to fetch answers");
    }
}));
//render answers
const renderAnswers = (data1, data2) => {
    if (!cenDiv)
        return;
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
        if (cenDiv)
            cenDiv.appendChild(anss);
        // Add event listener for the like button
        const likeBtn = document.getElementById(`ans-id-${Ans_id}`);
        if (likeBtn)
            likeBtn.addEventListener("click", () => addLikes(Ans_id));
    });
};
// Like the answer and update the likes count
const addLikes = (ans_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Send the like to the backend
        const api = `http://localhost:4900/likes/${ans_id}`;
        const response = yield fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        // If the like was successfully posted, update the like button and count
        if (response.ok) {
            const likeBtn = document.getElementById(`ans-id-${ans_id}`);
            likeBtn.disabled = true; // Disable the like button after clicking it
            // Increment the likes count on the page
            const likeCountElement = document.getElementById(`like-count-${ans_id}`);
            if (!likeCountElement)
                return;
            let currentLikes = parseInt(likeCountElement.innerText) || 0;
            likeCountElement.innerText = Number(currentLikes + 1).toString();
        }
    }
    catch (error) {
        console.error("Error on adding Likes to answer", error);
    }
});

