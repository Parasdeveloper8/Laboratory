import { scrollFetch } from "./reusefuns.js";
import { search } from "./reusefuns.js";

//Ids from qna-page.html
const dialogBox: HTMLElement | null = document.getElementById('dialogueBox');
const quesList: HTMLElement | null = document.getElementById("questions-list");
const loader: HTMLElement | null = document.getElementById("r-loader");
const searchValue: HTMLElement | null = document.getElementById("search-value");
const quePen: HTMLElement | null = document.getElementById("pen");
const closeDialogue: HTMLElement | null = document.getElementById("closeDialog");
const addQuesForm: HTMLElement | null = document.getElementById("addQues");

if(addQuesForm) {addQuesForm.addEventListener("submit",(e)=>e.preventDefault());}//Add event listener to form to prevent reloading

//Add event listener to form button to post question
document.addEventListener("DOMContentLoaded",()=>{
    const addQuesBtn:HTMLElement | null = document.getElementById("subBtn");
    if(addQuesBtn){
          addQuesBtn.addEventListener("click",addQue);
    }
});

if(loader)loader.style.display = 'block';

let page:number = 1;
let limit:number = 5;
let row:number = 0;
let isLoading:boolean = false; // To prevent multiple fetches at once

// Open dialog box to put question
const openDialog = () => {
    if(dialogBox) dialogBox.style.display = 'block';
}
if(quePen) quePen.addEventListener("click",openDialog);

// Close dialog box to put question
const closeDialog = () => {
    if(dialogBox) dialogBox.style.display = 'none';
}
if(closeDialogue) closeDialogue.addEventListener("click",closeDialog);

//search question
function searchQuestion(){
       if(!searchValue) return;
       //convert HTMLElement to HTMLInputElement
       const searchVal:HTMLInputElement = (searchValue as HTMLInputElement);
      const api:string = `http://localhost:4900/searchQues?val=${searchVal.value}`;
      search((quesList as HTMLDivElement),api,"No related question found",renderQues);
}

// Add question
const addQue = async () => {
    const category:HTMLElement | null = document.getElementById("select");
    const text:HTMLElement | null = document.getElementById("text");
    //convert HTMLElement to HTMLInputElement
    const categoryValue = (category as HTMLInputElement).value;
    const textValue = (text as HTMLInputElement).value;
    try {
        const api:string = `http://localhost:4900/post-ques/${textValue}/${categoryValue}`;
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
        const api:string = `http://localhost:4900/ques-data/${row}/${limit}`;
        const response = await fetch(api);
        const data = await response.json();

        // Check if there are no more questions to fetch
        if (data.data.length === 0) {
            if(loader) loader.style.display = 'none';  // Hide the loader
            return;  // No more data, stop fetching
        }
        if(loader) loader.style.display = 'none'; // Hide the loader when new data is fetched
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
const renderQues = (questionsToDisplay:any) => {
    questionsToDisplay.forEach((quest:any) => {
        const { Text, Username, Category, FormattedTime, Profile_Image, Id } = quest;
        const questionCard:HTMLDivElement = document.createElement("div");
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
        if(!quesList) return;
        
        quesList.appendChild(questionCard); // Append the newly created card

        // Bind event listeners for the dynamically created buttons
        const ansBtn:HTMLElement | null = document.getElementById(`ans-btn-${shortenedUuid}`);
        if(ansBtn) ansBtn.addEventListener("click", () => openPostAnsBox(shortenedUuid));

        const closeAnsBtn:HTMLElement | null  = document.getElementById(`close-ans-${shortenedUuid}`);
        if(closeAnsBtn) closeAnsBtn.addEventListener("click", () => closePostAnsBox(shortenedUuid));

        const ansForm:HTMLElement | null  = document.getElementById(`ans-form-${shortenedUuid}`);
        if(ansForm) ansForm.addEventListener("submit", (event) => subAns(event, shortenedUuid));

        const ansBox:HTMLElement | null  = document.getElementById(`show-ans-btn-${shortenedUuid}`);
        if(ansBox) ansBox.addEventListener("click", () => openShowAnsBox(shortenedUuid, Text));

        const closeAnsBtn2:HTMLElement | null  = document.getElementById(`closeAnsBox-${shortenedUuid}`);
        if(closeAnsBtn2) closeAnsBtn2.addEventListener('click', () => closeAnsBox(shortenedUuid));
    });
}

fetchQuestions();

// Open post answer dialogue box
const openPostAnsBox = (id:string) => {
    const postAnsDialogueBox:HTMLElement | null  = document.getElementById(`postAnsDia-${id}`);
    if(postAnsDialogueBox) postAnsDialogueBox.style.display = 'block';
}

// Close post answer dialogue box
const closePostAnsBox = (id:string) => {
    const postAnsDialogueBox:HTMLElement | null  = document.getElementById(`postAnsDia-${id}`);
    if(postAnsDialogueBox) postAnsDialogueBox.style.display = 'none';
}

// Submit Answer
const subAns = async (event:any, id:string) => {
    event.preventDefault();
    try {
        const answerText:HTMLElement | null  = document.getElementById(`answerText-${id}`);
        const ansTextValue = (answerText as HTMLInputElement).value;
        const api:string = `http://localhost:4900/post-ans/${id}/${ansTextValue}`;
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
const closeAnsBox = (id:string) => {
    document.title = "Ques & Ans";
    const ansBox:HTMLElement | null  = document.getElementById(`ansBox-${id}`);
    if(!ansBox) return;
    ansBox.style.display = 'none';
}

// Open Answers box
const openShowAnsBox = async (id:string, ques:string) => {
    const ansLoader:HTMLElement | null  = document.getElementById(`ans-loader-${id}`);
    if(ansLoader) ansLoader.style.display = 'block';
    try {
        const ansBox:HTMLElement | null  = document.getElementById(`ansBox-${id}`);
        
        // Clear the previous answers container before rendering
        const answersContainer:HTMLElement | null = document.getElementById(`answers-container-${id}`);
        if(!answersContainer) return;
        answersContainer.innerHTML = '';  // Clear any previous content
        if(ansBox) ansBox.style.display = 'block';

        const response = await fetch(`http://localhost:4900/answers/${id}`);
        const data = await response.json();

        const response2 = await fetch(`http://localhost:4900/likenums`);
        const data2 = await response2.json();
        if(ansLoader) ansLoader.style.display = 'none';
        renderAnswers(data.data, id, ques, data2.data); // Render new answers

        // Ensure layout and scrollbar behavior is correct after rendering answers
        setTimeout(() => {
            // Force a reflow to reset the overflow and ensure scrollbar visibility
            document.body.style.overflowY = 'auto';
        }, 100);
    } catch (error) {
        console.error("Error fetching answers", error);
        if(ansLoader) ansLoader.style.display = 'block';
    }
}

//render answers
const renderAnswers = (data1:any, id:string, ques:string, data2:any) => {
    const answersContainer:HTMLElement | null  = document.getElementById(`answers-container-${id}`);
    if(!answersContainer) return;
    answersContainer.style.maxHeight = '380px';
    answersContainer.style.overflowY = 'auto';

    // Map the likes data by Ans_id for easier access
    const likesMap = data2.reduce((acc:any, item:any) => {
        acc[item.Ans_id] = item.Likes_Number; // Store likes by Ans_id
        return acc;
    }, {});

    // Iterate over answers and render them
    data1.forEach((ans:any) => {
        const { Answer, Username, Ans_id } = ans;

        // Create a new div for the answer
        const anss:HTMLDivElement = document.createElement("div");

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
        if(answersContainer) answersContainer.appendChild(anss);

        // Add event listener for the like button
        const likeBtn:HTMLElement | null  = document.getElementById(`ans-id-${Ans_id}`);
        if(likeBtn) likeBtn.addEventListener("click", () => addLikes(Ans_id));
    });
}

// Like the answer and update the likes count
const addLikes = async (ans_id:string) => {
    try {
        // Send the like to the backend
        const api = `http://localhost:4900/likes/${ans_id}`;
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        // If the like was successfully posted, update the like button and count
        if (response.ok) {
            const likeBtn:HTMLElement | null  = document.getElementById(`ans-id-${ans_id}`);
            (likeBtn as HTMLButtonElement).disabled = true; // Disable the like button after clicking it

            // Increment the likes count on the page
            const likeCountElement:HTMLElement | null  = document.getElementById(`like-count-${ans_id}`);
            if(!likeCountElement) return;
            let currentLikes:number = parseInt(likeCountElement.innerText) || 0;
            likeCountElement.innerText = Number(currentLikes + 1).toString();
        }
    } catch (error) {
        console.error("Error on adding Likes to answer", error);
    }
}
const searchBar:HTMLElement | null  = document.getElementById("search-bar");
if(searchBar) searchBar.addEventListener("submit",(e)=>e.preventDefault());

document.addEventListener("DOMContentLoaded",()=>{
    const searchBtn:HTMLElement | null  = document.getElementById("search-btn");
    if(searchBtn){
          searchBtn.addEventListener("click",searchQuestion);
    }
});

// Scroll to load more questions
scrollFetch(fetchQuestions);
export{}