import { showCommentsDialog } from "./reusefuns.js";
import { search } from "./reusefuns.js";
//Ids from searchPage.html
const searchValue:HTMLElement | null = document.getElementById("search-value");
const div:HTMLElement | null = document.getElementById("blogs");
//const loader = document.getElementById('r-loader');
//loader.style.display = 'none';
//convert HTMLElement to HTMLInputElement
const _searchInValue = (searchValue as HTMLInputElement).value;
//search posts
function searchPost(){
    const api:string = `http://localhost:4900/search?val=${_searchInValue}`;
      search((div as HTMLDivElement),api,"No post found",renderBlogs);
}
const searchBar:HTMLElement | null = document.getElementById("search-bar");
if(searchBar) searchBar.addEventListener("submit",(e)=>e.preventDefault());

document.addEventListener("DOMContentLoaded",()=>{
    const searchBtn:HTMLElement|null = document.getElementById("search-btn");
    if(searchBtn) searchBtn.addEventListener("click",searchPost);
});

// Function to render blogs
function renderBlogs(blogs:any) {
    blogs.forEach((blog:any) => {
        const post_id:string = blog.Post_Id;
        const blogContainer:HTMLDivElement = document.createElement("div");
        blogContainer.className = "blog-item";
        blogContainer.style.cssText = "width: 300px; margin: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative; top:5vh;";

        const topBar:HTMLDivElement = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const nameBar:HTMLDivElement = document.createElement("div");
        nameBar.style.cssText = "display: flex; align-items: center;";

        const emailIcon:HTMLImageElement = document.createElement("img");
        if (blog.User_Image == null){
            emailIcon.src = "static/Images/avatar_face_only.png";
        }else{
        emailIcon.src = `data:image/jpeg;base64,${blog.User_Image}`;
        }
        emailIcon.alt = "User Icon";
        emailIcon.style.cssText = "width: 20px; height: 20px; margin-right: 8px;";

        nameBar.appendChild(emailIcon);
        nameBar.appendChild(document.createTextNode(blog.UserName));

        const uploadedTime:HTMLDivElement = document.createElement("div");
        uploadedTime.textContent = blog.FormattedTime;
        uploadedTime.style.cssText = "font-size: 12px; color: #777; text-align: right;";

        topBar.appendChild(nameBar);
        topBar.appendChild(uploadedTime);
        blogContainer.appendChild(topBar);

        const mediaWrapper:HTMLDivElement = document.createElement("div");
        mediaWrapper.style.cssText = "width: 100%; height: 200px; overflow: hidden;";

        // Check if the content is an image or video
        const base64String = blog.Base64string;
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

        const title:HTMLHeadingElement = document.createElement("h3");
        title.textContent = blog.Title;
        title.style.cssText = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        blogContainer.appendChild(mediaWrapper);
        blogContainer.appendChild(title);

        // Add "View Comments" link
        const viewCommentsLink:HTMLAnchorElement = document.createElement("a");
        viewCommentsLink.href = "#";
        viewCommentsLink.textContent = "View Comments";
        viewCommentsLink.style.cssText = "display: block; text-align: center; margin: 10px 0; color: #007bff; cursor: pointer;";
        viewCommentsLink.addEventListener("click", (e) => {
            e.preventDefault();
            fetchAndShowComments(post_id);
        });
        blogContainer.appendChild(viewCommentsLink);

        // Comment form for backend handling
        const commentForm:HTMLFormElement = document.createElement("form");
        commentForm.style.cssText = "padding: 10px; background: #fff; border-top: 1px solid #ddd;";
        commentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const comment = commentInput.value.trim();
            if (comment) await postComment(post_id, commentInput, commentList);
        });

        const commentInput:HTMLInputElement = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment...";
        commentInput.style.cssText = "width: calc(100% - 70px); padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;";

        const commentButton:HTMLButtonElement = document.createElement("button");
        commentButton.type = "submit";
        commentButton.textContent = "Post";
        commentButton.style.cssText = "padding: 8px 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;";

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        // Comment list container
        const commentSection:HTMLDivElement = document.createElement("div");
        commentSection.style.cssText = "max-height: 150px; overflow-y: auto; margin-top: 10px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;";
        const commentList:HTMLDivElement = document.createElement("div");
        commentSection.appendChild(commentList);

        blogContainer.appendChild(commentForm);
        blogContainer.appendChild(commentSection);
        if(div) div.appendChild(blogContainer);
    });
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
        console.log("Fetched comments:", comments); // Debugging line
        showCommentsDialog(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Function to post a comment
async function postComment(postId:string, commentInput:any, commentList:any) {
    const comment = commentInput.value.trim();
    if (comment) {
        try {
            const response = await fetch(`http://localhost:4900/post-comments/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment }),
            });
            commentInput.value = "";
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    }
}
export{}