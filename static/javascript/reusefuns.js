//All reusable functions
//ES modules
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//This function runs callback function when user
//reach at bottom of page
export function scrollFetch(callback) {
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
export function formatLike(num, countpara) {
    if (num >= 1000 && num < 1000000) {
        let divide = num / 1000;
        let result = divide + "K";
        countpara.innerText = result;
    }
    else if (num >= 1000000 && num < 1000000000) {
        let divide = num / 1000000;
        let result = divide + "M";
        countpara.innerText = result;
    }
    else if (num >= 1000000000) {
        let divide = num / 1000000000;
        let result = divide + "B";
        countpara.innerText = result;
    }
    else {
        countpara.innerText = String(num);
    }
}
//This function shows comments'dialog box which contains comments
export function showCommentsDialog(comments, senderId) {
    const dialog = document.createElement("div");
    dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; max-height: 300px; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow-y: auto; z-index: 1000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = "position: absolute; top: 10px; right: 10px; background: #ff5f5f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
    closeButton.addEventListener("click", () => dialog.remove());
    dialog.appendChild(closeButton);
    if (comments.length > 0) {
        comments.forEach((comment) => {
            const commentItem = document.createElement("div");
            commentItem.style.cssText = "padding: 10px 0; border-bottom: 1px solid #ddd;";
            // Comment text
            const commentText = document.createElement("div");
            commentText.innerHTML = `<div class="d-flex align-items-center">
                            <img src="${comment.Profile_Image ? `data:image/jpeg;base64,${comment.Profile_Image}` : 'static/Images/avatar_face_only.png'}" alt="User Icon" style="width: 30px; height: 30px; margin-right: 8px;">
                            <a href='/profile/${comment.ProfileId}/${senderId.value}' class='profile-link' title='visit ${comment.UserName} profile'><b>${comment.UserName}</b></a>
                            </div>
                            <div>
                            <p>${comment.Comment_Text}</p>
                            </div>
                            `;
            commentItem.appendChild(commentText);
            // Comment time
            const commentTime = document.createElement("div");
            const formattedTime = new Date(comment.FormattedTimeComment).toLocaleString(); // Format the timestamp
            commentTime.textContent = `Posted on: ${formattedTime}`;
            commentTime.style.cssText = "font-size: 12px; color: #777; margin-top: 5px;";
            commentItem.appendChild(commentTime);
            dialog.appendChild(commentItem);
        });
    }
    else {
        const noComments = document.createElement("div");
        noComments.textContent = "No comments yet.";
        noComments.style.cssText = "padding: 10px 0; color: #777;";
        dialog.appendChild(noComments);
    }
    document.body.appendChild(dialog);
}
//This function searches posts and questions
//It can be adjusted according to parameters
//This is reusable 
export function search(div, api, failInfo, renderFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        div.innerHTML = "";
        try {
            const searchAPI = api;
            const response = yield fetch(searchAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            //loader.style.display = 'none';
            const data = yield response.json();
            if (data.data == null) {
                div.innerHTML = `<p style='text-align:center;padding-top:10%;'>&#128528; ${failInfo}</p>`;
            }
            renderFunction(data.data);
        }
        catch (error) {
            console.error("Failed to search", error);
        }
    });
}
