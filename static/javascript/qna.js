const dialogBox = document.getElementById('dialogueBox');
const quesList = document.getElementById("questions-list");
const loader = document.getElementById("r-loader");

loader.style.display = 'block';

let page = 1;
let limit = 5;
let row = 0;
let isLoading = false; // To prevent multiple fetches at once

// Open dialog box to put question
const openDialog = () => {
    dialogBox.style.display = 'block';
}

// Close dialog box to put question
const closeDialog = () => {
    dialogBox.style.display = 'none';
}

// Add question
const addQue = async (event) => {
    const category = document.getElementById("select");
    const text = document.getElementById("text");
    event.preventDefault();
    try {
        const api = `http://localhost:4900/post-ques/${text.value}/${category.value}`;
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            closeDialog();
            fetchQuestions(); // Refresh the questions after submitting
        }
    } catch (error) {
        console.error("Error on posting question", error);
    }
}

const fetchQuestions = async () => {
    if (isLoading) return; // If the current fetch is still in progress, don't fetch again
    isLoading = true;

    try {
        const api = `http://localhost:4900/ques-data/${row}/${limit}`;
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
                    <h5 class="card-title">${Category}</h5>
                    <p class="card-text">${Text}</p>
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

// Open post answer dialogue box
const openPostAnsBox = (id) => {
    const postAnsDialogueBox = document.getElementById(`postAnsDia-${id}`);
    postAnsDialogueBox.style.display = 'block';
}

// Close post answer dialogue box
const closePostAnsBox = (id) => {
    const postAnsDialogueBox = document.getElementById(`postAnsDia-${id}`);
    postAnsDialogueBox.style.display = 'none';
}

// Submit Answer
const subAns = async (event, id) => {
    event.preventDefault();
    try {
        const answerText = document.getElementById(`answerText-${id}`);
        const api = `http://localhost:4900/post-ans/${id}/${answerText.value}`;
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            closePostAnsBox(id);
        }
    } catch (error) {
        console.error("Error on posting Answers", error);
    }
}

// Close Answers Box
const closeAnsBox = (id) => {
    document.title = "Ques & Ans";
    const ansBox = document.getElementById(`ansBox-${id}`);
    ansBox.style.display = 'none';
}

// Open Answers box
const openShowAnsBox = async (id, ques) => {
    const ansLoader = document.getElementById(`ans-loader-${id}`);
    ansLoader.style.display = 'block';
    try {
        const ansBox = document.getElementById(`ansBox-${id}`);
        
        // Clear only the dynamically added answers, leaving the close button and loader intact
        const answersContainer = document.getElementById(`answers-container-${id}`);
        if (answersContainer) {
            answersContainer.innerHTML = '';  // Clear previous answers
        }

        ansBox.style.display = 'block';

        const response = await fetch(`http://localhost:4900/answers/${id}`);
        const data = await response.json();

        if (data.data.length === 0) {
            ansLoader.style.display = 'block';
        }

        ansLoader.style.display = 'none';
        renderAnswers(data.data, id, ques); // Render new answers
    } catch (error) {
        console.error("Error fetching answers", error);
        ansLoader.style.display = 'block';
    }
}

// Render answers
const renderAnswers = (data, id, ques) => {
    const answersContainer = document.getElementById(`answers-container-${id}`);
    answersContainer.style.maxHeight = '380px';
    answersContainer.style.overflowY = 'auto';
    data.forEach((ans) => {
        const anss = document.createElement("div");

        const { Answer, Username ,Ans_id,Likes} = ans;

        answersContainer.appendChild(anss);  // Append to the answers container
        document.title = ques;
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
                    <div class="lk-div">
                    <button class="like-btn" id="ans-id-${Ans_id}"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>
                     <p>${Likes}</p>
                    </div>
                    </div>
            </div>
        `;
        const likeBtn = document.getElementById(`ans-id-${Ans_id}`);
         likeBtn.addEventListener("click",()=>addLikes(Ans_id,Likes));
    });
}


const addLikes=async(ans_id,arglike)=>{
      try{
        let dataAr = {
            "likes":arglike,
            "ans_id":ans_id
        }
        dataAr.likes++;
       const api = `http://localhost:4900/${dataAr.ans_id}/${dataAr.likes}`;
       const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
        const likeBtn = document.getElementById(`ans-id-${ans_id}`);
        likeBtn.disabled = true;
    }
}catch(error){
       console.error("Error on adding Likes to answer",error)
}
}

// Scroll to load more questions
window.addEventListener('scroll', () => { 
    const scrollPosition = window.scrollY + window.innerHeight; 
    const documentHeight = document.documentElement.scrollHeight; 

    if (scrollPosition >= documentHeight - 10) {
        fetchQuestions();
    } 
});
