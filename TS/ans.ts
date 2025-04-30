//id from ansPage.html
const cenDiv = document.getElementById("central-cont");

document.addEventListener("DOMContentLoaded",async ()=>{
    try{
    const pathParts = window.location.pathname.split("/");
    const queId = pathParts[2];

    const response = await fetch(`http://localhost:4900/answers/${queId}`);
    const data = await response.json();

    const response2 = await fetch(`http://localhost:4900/likenums`);
    const data2 = await response2.json();

    renderAnswers(data.data, data2.data); // Render new answers

    }catch(error){
        console.log("Failed to fetch answers");
    }
});

//render answers
const renderAnswers = (data1:any, data2:any) => {
    if(!cenDiv) return;

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
        if(cenDiv) cenDiv.appendChild(anss);

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
export {}