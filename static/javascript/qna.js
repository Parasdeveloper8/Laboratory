const dialogBox = document.getElementById('dialog');
const text = document.getElementById("text");
const category = document.getElementById("select");
const quesList = document.getElementById("questions-list");
const header = document.getElementById("header");
const UserNameText = document.getElementById("username");
const timeText = document.getElementById("time");
const categoryText = document.getElementById("category");
const quesText = document.getElementById("text");
const loader = document.getElementById("r-loader");
const floader = document.getElementById("fail-loader");
floader.style.display = 'none';
loader.style.display = 'block';
let page = 1;
let limit = 5;
let row= 0;
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
            // If no more questions, stop fetching and show a message or indication
            floader.style.display = 'none'; // Hide the fail loader if there is no more data
            loader.style.display = 'none';  // Hide the loader
            return;  // No more data, stop fetching
        }

        loader.style.display = 'none'; // Hide the loader when new data is fetched
        row += limit;  // Update the row to the next set of questions
        page++;  // Update page number for pagination
        renderQues(data.data);  // Render new questions
    } catch (error) {
        console.error("Error on fetching questions", error);
        floader.style.display = 'block';  // Show fail loader if there is an error
    } finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}


// Render questions dynamically
const renderQues = (questionsToDisplay) => {

    questionsToDisplay.forEach(quest => {
        const { Text, Username, Id, Category, FormattedTime, Profile_Image } = quest;

        const questionCard = document.createElement("div");
        questionCard.classList.add("col-12", "col-md-6", "mb-3"); // Use col-md-6 for 2 cards per row, col-12 for full width on small screens

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
            </div>
        `;
        quesList.appendChild(questionCard); // Append the newly created card
    });
}
window.addEventListener('scroll', () => { 
    const scrollPosition = window.scrollY + window.innerHeight; 
    const documentHeight = document.documentElement.scrollHeight; 
    
    if (scrollPosition >= documentHeight -10) {
        fetchQuestions();
    } 
}); 
 fetchQuestions();
