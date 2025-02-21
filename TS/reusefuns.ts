//All reusable functions
//ES modules

//This function runs callback function when user
//reach at bottom of page
export function scrollFetch(callback:any){
    // Adding scroll event to load more blogs when scrolled to the bottom
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
    
        if (scrollPosition >= documentHeight - 10) {
            //Callback function will be run
            callback();
        }
    });
    }
   
    //This function is used to format likes on behalf of their number
    //Adding K,M,B after likes
    //num is number of likes
    //countpara is  HTMLParagraphElement
export function formatLike(num:number,countpara:HTMLElement | HTMLParagraphElement){
        if (num >= 1000 && num < 1000000 ){
            let divide = num / 1000;
            let result = divide + "K";
            countpara.innerText = result;
        }else if(num >= 1000000 && num < 1000000000 ){
            let divide = num / 1000000;
            let result = divide + "M";
            countpara.innerText = result;
        }else if(num >= 1000000000){
            let divide = num / 1000000000;
            let result = divide + "B";
            countpara.innerText = result;
        }else{
            countpara.innerText = String(num);
        }
    }


//This function shows comments'dialog box which contains comments
export function showCommentsDialog(comments:any) {
    const dialog:HTMLDivElement = document.createElement("div");
    dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; max-height: 300px; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow-y: auto; z-index: 1000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";

    const closeButton:HTMLButtonElement= document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = "position: absolute; top: 10px; right: 10px; background: #ff5f5f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
    closeButton.addEventListener("click", () => dialog.remove());

    dialog.appendChild(closeButton);

    if (comments.length > 0) {
        comments.forEach((comment:any) => {
            const commentItem :HTMLDivElement = document.createElement("div");
            commentItem.style.cssText = "padding: 10px 0; border-bottom: 1px solid #ddd;";

            // Comment text
            const commentText :HTMLDivElement= document.createElement("div");
            commentText.textContent = `${comment.UserName}: ${comment.Comment_Text}`;
            commentItem.appendChild(commentText);

            // Comment time
            const commentTime :HTMLDivElement= document.createElement("div");
            const formattedTime = new Date(comment.FormattedTimeComment).toLocaleString(); // Format the timestamp
            commentTime.textContent = `Posted on: ${formattedTime}`;
            commentTime.style.cssText = "font-size: 12px; color: #777; margin-top: 5px;";
            commentItem.appendChild(commentTime);

            dialog.appendChild(commentItem);
        });
    } else {
        const noComments :HTMLDivElement= document.createElement("div");
        noComments.textContent = "No comments yet.";
        noComments.style.cssText = "padding: 10px 0; color: #777;";
        dialog.appendChild(noComments);
    }

    document.body.appendChild(dialog);
}

//This function searches posts and questions
//It can be adjusted according to parameters
//This is reusable 
export async function search (div:HTMLDivElement,api:string,failInfo:any,renderFunction:any){
    div.innerHTML = "";
    try{
     const searchAPI = api;
     const response = await fetch(searchAPI,{
        method:"POST",
        headers:{ "Content-Type": "application/json" }
     });
     if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    //loader.style.display = 'none';
    const data = await response.json();
    if(data.data == null){
        div.innerHTML = `<p style='text-align:center;padding-top:10%;'>&#128528; ${failInfo}</p>`;
    }
    renderFunction(data.data);
    }
    catch(error){
        console.error("Failed to search", error);
    }
}
export {}