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
const textarea:HTMLElement | null = document.getElementById('text');

if(addQuesForm) {addQuesForm.addEventListener("submit",(e)=>e.preventDefault());}//Add event listener to form to prevent reloading


function autoResizeTextArea(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

textarea?.addEventListener('input', () => autoResizeTextArea(textarea as HTMLTextAreaElement));


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

    const jsonData = {
          text:textValue,
          category:categoryValue
    }
    try {
        const api:string = `http://localhost:4900/post-ques`;
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
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
        const { Text, Username, Category, FormattedTime, Profile_Image, Id ,ProfileId} = quest;
        const questionCard:HTMLDivElement = document.createElement("div");
        questionCard.classList.add("col-12", "col-md-6", "mb-3"); // Use col-md-6 for 2 cards per row, col-12 for full width on small screens

        const shortenedUuid = Id.replace(/-/g, ''); // Remove hyphens

        questionCard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${Profile_Image ? `data:image/jpeg;base64,${Profile_Image}` : 'static/Images/avatar_face_only.png'}" alt="User Icon" style="width: 30px; height: 30px; margin-right: 8px;">
                            <a href='/profile/${ProfileId}' class='profile-link' title='visit ${Username} profile'><b>${Username}</b></a>
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
        if(!quesList) return;
        
        quesList.appendChild(questionCard); // Append the newly created card

        // Bind event listeners for the dynamically created buttons
        const ansBtn:HTMLElement | null = document.getElementById(`ans-btn-${shortenedUuid}`);
        if(ansBtn) ansBtn.addEventListener("click", () => openPostAnsBox(shortenedUuid));

        const textarea2:HTMLElement | null = document.getElementById(`answerText-${shortenedUuid}`);
        if(textarea2) textarea2.addEventListener('input', () => autoResizeTextArea(textarea2 as HTMLTextAreaElement));

        const closeAnsBtn:HTMLElement | null  = document.getElementById(`close-ans-${shortenedUuid}`);
        if(closeAnsBtn) closeAnsBtn.addEventListener("click", () => closePostAnsBox(shortenedUuid));

        const ansForm:HTMLElement | null  = document.getElementById(`ans-form-${shortenedUuid}`);
        if(ansForm) ansForm.addEventListener("submit", (event) => subAns(event, shortenedUuid));

        const ansBox:HTMLElement | null  = document.getElementById(`show-ans-btn-${shortenedUuid}`);
        if(ansBox) ansBox.addEventListener("click", () => {
            //encode Text to prevent URL errors
            const encodedText = encodeURIComponent(Text);
            window.location.href=`/answersPage/${encodedText}/${shortenedUuid}`
        });

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
        const api:string = `http://localhost:4900/post-ans`;
        const jsonData = {
            id:id,
            answer:ansTextValue
        }
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(jsonData)
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