const quesList = document.getElementById("questions-list");
const loader = document.getElementById("r-loader");

loader.style.display = 'block';

let page = 1;
let limit = 5;
let row = 0;
let isLoading = false; // To prevent multiple fetches at once


const fetchQuestions = async () => {
    if (isLoading) return; // If the current fetch is still in progress, don't fetch again
    isLoading = true;

    try {
        const api = `http://localhost:4900/myques-data/${row}/${limit}`;
        const response = await fetch(api);
        const data = await response.json();

        // Check if there are no more questions to fetch
        if (data.data.length === 0) {
            loader.style.display = 'none';  // Hide the loader
            return;  // No more data, stop fetching
        }

        loader.style.display = 'none'; // Hide the loader when new data is fetched
        row += limit;  // Update the row to the next set of questions
        page++;  // Update page number for pagination
        renderQues(data.data);  // Render new questions
    } catch (error) {
        console.error("Error on fetching questions", error);
    } finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

// Render questions dynamically
const renderQues = (questionsToDisplay) => {
    questionsToDisplay.forEach(quest => {
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
                    <input type="text" placeholder="Your Answer here" name="ans" id="answerText-${shortenedUuid}" style="border:2px solid black;">
                    <br>
                    <br>
                    <button type="submit" class="sub-btn">Post Answer</button>
                </form>
            </div>
        `;

        quesList.appendChild(questionCard); // Append the newly created card

        // Bind event listeners for the dynamically created buttons
        const ansBtn = document.getElementById(`ans-btn-${shortenedUuid}`);
        ansBtn.addEventListener("click", () => openPostAnsBox(shortenedUuid));

        const closeAnsBtn = document.getElementById(`close-ans-${shortenedUuid}`);
        closeAnsBtn.addEventListener("click", () => closePostAnsBox(shortenedUuid));

        const ansForm = document.getElementById(`ans-form-${shortenedUuid}`);
        ansForm.addEventListener("submit", (event) => subAns(event, shortenedUuid));

        const ansBox = document.getElementById(`show-ans-btn-${shortenedUuid}`);
        ansBox.addEventListener("click", () => openShowAnsBox(shortenedUuid, Text));

        const closeAnsBtn2 = document.getElementById(`closeAnsBox-${shortenedUuid}`);
        closeAnsBtn2.addEventListener('click', () => closeAnsBox(shortenedUuid));
    });
}

fetchQuestions();

//render answers
const renderAnswers = (data1, id, ques, data2) => {
    const answersContainer = document.getElementById(`answers-container-${id}`);
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

        // Add event listener for the like button
        const likeBtn = document.getElementById(`ans-id-${Ans_id}`);
        likeBtn.addEventListener("click", () => addLikes(Ans_id));
    });
}

// Scroll to load more questions
window.addEventListener('scroll', () => { 
    const scrollPosition = window.scrollY + window.innerHeight; 
    const documentHeight = document.documentElement.scrollHeight; 

    if (scrollPosition >= documentHeight - 10) {
        fetchQuestions();
    } 
});