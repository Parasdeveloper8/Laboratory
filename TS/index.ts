import { scrollFetch ,formatLike,showCommentsDialog} from "./reusefuns.js";

//loader
const loader : HTMLElement | null = document.getElementById('r-loader');

//loads when fail to display more posts
const failLoader : HTMLElement | null = document.getElementById("fail-loader");

let page = 1;
//both will be used for database query
let limit = 3;//max limit
let row = 0;//row 0

if(loader) loader.style.display = 'block';

if(failLoader) failLoader.style.display = 'none';

let isLoading : boolean = false; // To prevent multiple fetches at once

document.addEventListener('DOMContentLoaded', () => {
    //sidebar
    const sidebar :HTMLElement | null = document.getElementById('desktopSidebar');
    if(sidebar){
    if (window.innerWidth > 768) {
        sidebar.style.display = 'block';
    }
}
});

// Function to fetch data from the API
async function fetchBlogs() {
    if (isLoading) return; // If isLoading is true, return early to prevent multiple fetches at once
    isLoading = true;
    try {
        // API 1 - Fetch blogs
        const response = await fetch(`http://localhost:4900/blogs/${row}/${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // API 2 - Fetch likes count
        const response2 = await fetch("http://localhost:4900/postlikenums");
        const data2 = await response2.json();
       
        //Ensures json is always array
        //if(!Array.isArray(data2))data2=[];
        if(loader) loader.style.display = 'none';
        
        row++;
        page++;
        renderBlogs(data.data, data2.data);
    } catch (error) {
        //when error encountered
        //start showing loaders
        console.error("Error fetching blogs:", error);
        if(loader) loader.style.display = 'none';
        if(failLoader) failLoader.style.display = 'block';
    } finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

// Function to render blogs
function renderBlogs(blogs:any, data2:any) {
    const div: HTMLElement | null= document.getElementById("blogs");

    // Map the likes data by PostId for easier access
    const likesMap = (data2 ?? []).reduce((acc:any, item:any) => {
        if (item && item.PostId !== null && item.Likes_Number !== null) { 
            acc[item.PostId] = item.Likes_Number; 
        }
        return acc;
    }, {});
    
    //loop over blogs variable
    blogs.forEach((blog:any) => {
        const likeCount = likesMap[blog.Post_Id] || 0; // Use blog.Post_Id for the correct like count
        
        const post_id = blog.Post_Id;
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";

        const topBar : HTMLDivElement = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const nameBar : HTMLDivElement = document.createElement("div");
        nameBar.style.cssText = "display: flex; align-items: center;";

        const emailIcon : HTMLImageElement = document.createElement("img");
        if (blog.User_Image == null) {
            emailIcon.src = "static/Images/avatar_face_only.png";
        } else {
            emailIcon.src = `data:image/jpeg;base64,${blog.User_Image}`;
        }
        emailIcon.alt = "User Icon";
        emailIcon.style.cssText = "width: 20px; height: 20px; margin-right: 8px;";

        nameBar.appendChild(emailIcon);
        nameBar.appendChild(document.createTextNode(blog.UserName));

        const uploadedTime : HTMLDivElement = document.createElement("div");
        uploadedTime.textContent = blog.FormattedTime;
        uploadedTime.style.cssText = "font-size: 12px; color: #777; text-align: right;";

        topBar.appendChild(nameBar);
        topBar.appendChild(uploadedTime);
        blogContainer.appendChild(topBar);

        const mediaWrapper : HTMLDivElement= document.createElement("div");
        mediaWrapper.style.cssText = "width: 100%; height: 200px; overflow: hidden;";

        // Check if the content is an image or video
        const base64String:string = blog.Base64string;
        if (base64String.startsWith("/9j") || base64String.startsWith("iVBORw")) {
            // Render as an image
            const img : HTMLImageElement = document.createElement("img");
            img.src = `data:image/jpeg;base64,${base64String}`;
            img.alt = blog.Title;
            img.style.cssText = "width: 100%; height:100%; object-fit: cover;";
            mediaWrapper.appendChild(img);
        } else {
            // Render as a video
            const video : HTMLVideoElement = document.createElement("video");
            video.src = `data:video/mp4;base64,${base64String}`;
            video.controls = true;
            video.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(video);
        }

        const title : HTMLHeadingElement = document.createElement("h3");
        title.textContent = blog.Title;
        title.style.cssText = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        blogContainer.appendChild(mediaWrapper);
        blogContainer.appendChild(title);

        // Add "View Comments" link
        const viewCommentsLink : HTMLAnchorElement = document.createElement("a");
        viewCommentsLink.href = "#";
        viewCommentsLink.textContent = "View Comments";
        viewCommentsLink.style.cssText = "display: block; text-align: center; margin: 10px 0; color: #007bff; cursor: pointer;";
        viewCommentsLink.addEventListener("click", (e) => {
            e.preventDefault();
            fetchAndShowComments(post_id);
        });
        blogContainer.appendChild(viewCommentsLink);

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
        //share button
       /* const shareBtn = document.createElement("button");
        shareBtn.id = `share${blog.Post_Id}`;
         shareBtn.className = 'like-btn';
         shareBtn.innerHTML = `
            <i class="fa fa-share-alt" aria-hidden="true"></i>
          `;
         divfBtn.appendChild(shareBtn);*/

        // Append both button and count to div
        divfBtn.appendChild(button);
        divfBtn.appendChild(countp); // Correctly append the count

        blogContainer.appendChild(divfBtn);

        // Add event listener for the like button
        button.addEventListener("click", () => addLikes(blog.Post_Id));

        // Comment form for backend handling
        const commentForm : HTMLFormElement= document.createElement("form");
        commentForm.style.cssText = "padding: 10px; background: #fff; border-top: 1px solid #ddd;";
        commentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const comment :string = commentInput.value.trim();
            if (comment) {
                await postComment(post_id, commentInput, commentList);
            }
        });

        const commentInput:HTMLInputElement = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment...";
        commentInput.style.cssText = "width: calc(100% - 70px); padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;";

        const commentButton :HTMLButtonElement = document.createElement("button");
        commentButton.type = "submit";
        commentButton.textContent = "Post";
        commentButton.style.cssText = "padding: 8px 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor:pointer;";

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        // Comment list container
        const commentSection : HTMLDivElement = document.createElement("div");
        commentSection.style.cssText = "max-height: 150px; overflow-y: auto; margin-top: 10px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;";
        const commentList = document.createElement("div");
        commentSection.appendChild(commentList);

        blogContainer.appendChild(commentForm);
        blogContainer.appendChild(commentSection);
         if(div) div.appendChild(blogContainer);
    });
}

// Function to fetch comments and show dialog
async function fetchAndShowComments(postId:any) {
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
async function postComment(postId:any, commentInput:any, commentList:any) {
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
// Like the answer and update the likes count
const addLikes = async (post_id:any) => {
    try {
        // Send the like to the backend
        const api = `http://localhost:4900/postlikes/${post_id}`;
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        // If the like was successfully posted, update the like button and count
        if (response.ok) {
            const likeBtn = document.getElementById(`postlike${post_id}`);
            if(likeBtn) (likeBtn as HTMLButtonElement).disabled = true; // Disable the like button after clicking it
            if(!likeBtn) return ;
            // Increment the likes count on the page
            const countElement = likeBtn.nextElementSibling; // Get the like count paragraph
            if(!countElement) return
            let currentLikes = parseInt((countElement as HTMLElement).innerText) || 0;
            (countElement as HTMLElement).innerText  = String(currentLikes + 1); // Increment the like count
        }
    } catch (error) {
        console.error("Error on adding Likes to answer", error);
    }
}

scrollFetch(fetchBlogs);

// Initial fetch
fetchBlogs();

export {}