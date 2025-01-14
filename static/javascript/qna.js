const dialogBox = document.getElementById('dialogueBox');

const quesList = document.getElementById("questions-list");

const loader = document.getElementById("r-loader");

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
            // If no more questions, stop fetching and show a message or indication
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
//let TotalAns = 1;
const renderQues = (questionsToDisplay) => {

    questionsToDisplay.forEach(quest => {
        const { Text, Username, Category, FormattedTime, Profile_Image ,Id} = quest;
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
                <button id="ans-btn" onclick="openPostAnsBox()">Add Answer</button>
                <button id="show-ans-btn" onclick="openShowAnsBox()">show Answers</button>
            </div>

            <div class="dialog" id="postAnsDialogue">
        <button onclick="closePostAnsBox()" class="close">X</button>
        <form id="ans-form-${Id}">
        <input type="text" placeholder="Your Answer here" name="ans" id="answerText" style="border:2px solid black;">
        <br>
        <br>
        <button type="submit" class="sub-btn">Post Answer</button>
        </form>
    </div>
        `;
        quesList.appendChild(questionCard); // Append the newly created card
       const ansForm = document.getElementById(`ans-form-${Id}`);
        ansForm.addEventListener("submit",(event)=>subAns(event,Id));
    });
}

fetchQuestions();
  //open post answer dialogue box
 const openPostAnsBox = () =>{
    const postAnsDialogueBox = document.getElementById("postAnsDialogue");
       postAnsDialogueBox.style.display = 'block';
 }

 //close post answer dialogue box
 const closePostAnsBox = () =>{
    const postAnsDialogueBox = document.getElementById("postAnsDialogue");
       postAnsDialogueBox.style.display = 'none';
 }

 const subAns = async(event,id) =>{
    event.preventDefault();
    try{
    const answerText = document.getElementById("answerText");
    const api = `http://localhost:4900/post-ans/${id}/${answerText.value}`;
    const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
        closePostAnsBox();
    }
}
catch(error){
    console.error("Error on posting Answers", error);
}
 }
 window.addEventListener('scroll', () => { 
    const scrollPosition = window.scrollY + window.innerHeight; 
    const documentHeight = document.documentElement.scrollHeight; 
    
    if (scrollPosition >= documentHeight -10) {
        fetchQuestions();
    } 
}); 

