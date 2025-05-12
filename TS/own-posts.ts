import { scrollFetch } from "./reusefuns.js";
import { formatLike } from "./reusefuns.js";
//Ids from ownPostPage.html
const loader:HTMLElement | null = document.getElementById('r-loader');
const failLoader:HTMLElement | null = document.getElementById("f-loader");
const senderId:HTMLElement | null = document.getElementById('sender');
if(loader) loader.style.display = 'block';
if(failLoader) failLoader.style.display = 'none';

let page:number = 1;
let limit:number = 3;
let row:number = 0;
let isLoading:boolean = false; // To prevent multiple fetches at once

// Function to fetch data from the API
async function fetchMyBlogs() {
    if (isLoading) return; // Prevent multiple fetches
    isLoading = true;
    try {
        const response = await fetch(`http://localhost:4900/my-posts/${row}/${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //Fetch likes count
        const response2 = await fetch("http://localhost:4900/postlikenums");
        const data2 = await response2.json();
        if(!response2.ok){
            throw new Error(`HTTP error! status: ${response2.status}`);
        }
        if(loader) loader.style.display = 'none';
        row++;
        page++;
        renderBlogs(data.data,data2.data);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        if(loader) loader.style.display = 'none';
        if(failLoader) failLoader.style.display='block';
    }finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

// Function to render blogs
function renderBlogs(blogs:any,data2:any) {
    const div:HTMLElement | null = document.getElementById("blogs");
    
    // Map the likes data by PostId for easier access
    const likesMap = (data2 ?? []).reduce((acc:any, item:any) => {
        if (item && item.PostId !== null && item.Likes_Number !== null) { 
            acc[item.PostId] = item.Likes_Number; 
        }
        return acc;
    }, {});

    blogs.forEach((blog:any) => {
        const likeCount = likesMap[blog.Post_id] || 0; // Use blog.Post_Id for the correct like count
        const post_id:string = blog.Post_id;
        //console.log(blog.Formattedtime);
        const blogContainer:HTMLDivElement = document.createElement("div");
        blogContainer.className = "blog-item";

        // Create the top bar
        const topBar:HTMLDivElement = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        // Uploaded time
        const uploadedTime:HTMLDivElement = document.createElement("div");
        uploadedTime.textContent = blog.Formattedtime;
        uploadedTime.style.cssText = "font-size: 12px; color: #777; text-align: right;";

        // Trash bin icon (delete button)
        const trashBinIcon:HTMLDivElement = document.createElement("div");
        trashBinIcon.innerHTML = "🗑️"; // Trash bin emoji
        trashBinIcon.style.cssText = "cursor: pointer; font-size: 20px; color: #333;";

        // Delete button click event
        trashBinIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click event from bubbling up
            showDeleteConfirmation(post_id); // Show the confirmation dialog
        });

        // Append elements to top bar
        topBar.appendChild(uploadedTime);
        topBar.appendChild(trashBinIcon);
        blogContainer.appendChild(topBar);

        // Media wrapper (image or video)
        const mediaWrapper:HTMLDivElement = document.createElement("div");
        mediaWrapper.style.cssText = "width: 100%; height: 200px; overflow: hidden;";

        const base64String:string = blog.Base64string;
        if (base64String.startsWith("/9j") || base64String.startsWith("iVBORw")) {
            // Render as an image
            const img:HTMLImageElement = document.createElement("img");
            img.src = `data:image/jpeg;base64,${base64String}`;
            img.alt = blog.Title;
            img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(img);
        } else {
            // Render as a video
            const video:HTMLVideoElement = document.createElement("video");
            video.src = `data:video/mp4;base64,${base64String}`;
            video.controls = true;
            video.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(video);
        }

        // Title
        const title:HTMLHeadingElement = document.createElement("h3");
        title.textContent = blog.Title;
        title.style.cssText = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        // Add "View Comments" link
        const viewCommentsLink:HTMLAnchorElement = document.createElement("a");
        viewCommentsLink.href = "#";
        viewCommentsLink.textContent = "View Comments";
        viewCommentsLink.style.cssText = "display: block; text-align: center; margin: 10px 0; color: #007bff; cursor: pointer;";
        viewCommentsLink.addEventListener("click", (e) => {
            e.preventDefault();
            fetchAndShowComments(post_id);
        });
        
        // DIV to containing button and count of likes
        const divfBtn : HTMLDivElement = document.createElement("div");

        // Like button
        const button : HTMLButtonElement = document.createElement("button");
        button.id = `postlike${blog.Post_Id}`;
        button.className = "like-btn";
        button.innerHTML = `
            <i class="fa fa-heart" aria-hidden="true"></i>
        `;

        // Like count
        const countp : HTMLParagraphElement= document.createElement("p");
        formatLike(likeCount,countp);
         divfBtn.className = "lk-div";

          // Append both button and count to div
        divfBtn.appendChild(button);
        divfBtn.appendChild(countp); // Correctly append the count

        // Append everything to the blog container
        blogContainer.appendChild(mediaWrapper);
        blogContainer.appendChild(title);
        blogContainer.appendChild(viewCommentsLink);
        blogContainer.appendChild(divfBtn);
        if(!div) return;
        // Append the blog container to the main div
        div.appendChild(blogContainer);
    });
}

// Function to delete the blog post
async function deleteBlog(postId:string) {
    try {
        const response = await fetch(`http://localhost:4900/delete-post/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Reload page on successful deletion after delay of 3 secs
        setTimeout(()=>location.reload(),3000);
    } catch (error) {
        console.error("Error deleting blog:", error);
    }
}

// Function to fetch comments and show dialog
async function fetchAndShowComments(postId:string) {
    try {
        const response = await fetch(`http://localhost:4900/get-comments/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const comments = data.data || [];
        //console.log("Fetched comments:", comments); // Debugging line
        showCommentsDialog(comments,(senderId as HTMLInputElement));
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Function to show comments dialog
function showCommentsDialog(comments:any,senderId:HTMLInputElement) {
    const dialog:HTMLDivElement = document.createElement("div");
    dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; max-height: 300px; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow-y: auto; z-index: 1000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";

    const closeButton:HTMLButtonElement = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = "position: absolute; top: 10px; right: 10px; background: #ff5f5f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
    closeButton.addEventListener("click", () => dialog.remove());

    dialog.appendChild(closeButton);

    if (comments.length > 0) {
        comments.forEach((comment:any) => {
            const commentItem:HTMLDivElement = document.createElement("div");
            commentItem.style.cssText = "padding: 10px 0; border-bottom: 1px solid #ddd;";

             // Comment text
            const commentText :HTMLDivElement= document.createElement("div");
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
            const commentTime:HTMLDivElement = document.createElement("div");
            const formattedTime = new Date(comment.FormattedTimeComment).toLocaleString(); // Format the timestamp
            commentTime.textContent = `Posted on: ${formattedTime}`;
            commentTime.style.cssText = "font-size: 12px; color: #777; margin-top: 5px;";
            commentItem.appendChild(commentTime);

            dialog.appendChild(commentItem);
        });
    } else {
        const noComments:HTMLDivElement = document.createElement("div");
        noComments.textContent = "No comments yet.";
        noComments.style.cssText = "padding: 10px 0; color: #777;";
        dialog.appendChild(noComments);
    }

    document.body.appendChild(dialog);
}

// Function to show delete confirmation modal
function showDeleteConfirmation(postId:string) {
    const modal:HTMLDivElement = document.createElement("div");
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;";

    const confirmationBox:HTMLDivElement = document.createElement("div");
    confirmationBox.style.cssText = "background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; width: 300px;";

    const message:HTMLParagraphElement  = document.createElement("p");
    message.textContent = "Are you sure you want to delete this post?";
    message.style.cssText = "font-size: 16px; color: #333; margin-bottom: 20px;";

    const buttonContainer:HTMLDivElement = document.createElement("div");
    buttonContainer.style.cssText = "display: flex; justify-content: space-around;";

    const cancelButton:HTMLButtonElement = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = "background-color: #ccc; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    cancelButton.addEventListener("click", () => modal.remove());

    const okButton:HTMLButtonElement = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.cssText = "background-color: #ff5f5f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    okButton.addEventListener("click", () => {
        deleteBlog(postId);
        modal.remove();
    });

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);

    confirmationBox.appendChild(message);
    confirmationBox.appendChild(buttonContainer);
    modal.appendChild(confirmationBox);
    document.body.appendChild(modal);
}

scrollFetch(fetchMyBlogs);
// Fetch and render blogs on page load
fetchMyBlogs();
export{}