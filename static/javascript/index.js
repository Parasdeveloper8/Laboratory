const loader = document.getElementById('r-loader');
const failLoader = document.getElementById("fail-loader");
let page = 1;
let limit = 3;
let row = 0;
loader.style.display = 'block';
failLoader.style.display = 'none';
let isLoading = false; // To prevent multiple fetches at once

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('desktopSidebar');
    if (window.innerWidth > 768) {
        sidebar.style.display = 'block';
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

        loader.style.display = 'none';
        row++;
        page++;
        renderBlogs(data.data, data2.data);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        loader.style.display = 'none';
        failLoader.style.display = 'block';
    } finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

//Add K ,M,B in likes
function formatLike(num,countpara){
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
        countpara.innerText = num;
    }
}

// Function to render blogs
function renderBlogs(blogs, data2) {
    const div = document.getElementById("blogs");

    // Map the likes data by PostId for easier access
    const likesMap = data2.reduce((acc, item) => {
        acc[item.PostId] = item.Likes_Number; // Store likes by PostId
        return acc;
    }, {});

    blogs.forEach(blog => {
        const likeCount = likesMap[blog.Post_Id] || 0; // Use blog.Post_Id for the correct like count

        const post_id = blog.Post_Id;
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";

        const topBar = document.createElement("div");
        topBar.style = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const nameBar = document.createElement("div");
        nameBar.style = "display: flex; align-items: center;";

        const emailIcon = document.createElement("img");
        if (blog.User_Image == null) {
            emailIcon.src = "static/Images/avatar_face_only.png";
        } else {
            emailIcon.src = `data:image/jpeg;base64,${blog.User_Image}`;
        }
        emailIcon.alt = "User Icon";
        emailIcon.style = "width: 20px; height: 20px; margin-right: 8px;";

        nameBar.appendChild(emailIcon);
        nameBar.appendChild(document.createTextNode(blog.UserName));

        const uploadedTime = document.createElement("div");
        uploadedTime.textContent = blog.FormattedTime;
        uploadedTime.style = "font-size: 12px; color: #777; text-align: right;";

        topBar.appendChild(nameBar);
        topBar.appendChild(uploadedTime);
        blogContainer.appendChild(topBar);

        const mediaWrapper = document.createElement("div");
        mediaWrapper.style = "width: 100%; height: 200px; overflow: hidden;";

        // Check if the content is an image or video
        const base64String = blog.Base64string;
        if (base64String.startsWith("/9j") || base64String.startsWith("iVBORw")) {
            // Render as an image
            const img = document.createElement("img");
            img.src = `data:image/jpeg;base64,${base64String}`;
            img.alt = blog.Title;
            img.style = "width: 100%; height:100%; object-fit: cover;";
            mediaWrapper.appendChild(img);
        } else {
            // Render as a video
            const video = document.createElement("video");
            video.src = `data:video/mp4;base64,${base64String}`;
            video.controls = true;
            video.style = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(video);
        }

        const title = document.createElement("h3");
        title.textContent = blog.Title;
        title.style = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        blogContainer.appendChild(mediaWrapper);
        blogContainer.appendChild(title);

        // Add "View Comments" link
        const viewCommentsLink = document.createElement("a");
        viewCommentsLink.href = "#";
        viewCommentsLink.textContent = "View Comments";
        viewCommentsLink.style = "display: block; text-align: center; margin: 10px 0; color: #007bff; cursor: pointer;";
        viewCommentsLink.addEventListener("click", (e) => {
            e.preventDefault();
            fetchAndShowComments(post_id);
        });
        blogContainer.appendChild(viewCommentsLink);

        // DIV to containing button and count of likes
        const divfBtn = document.createElement("div");

        // Like button
        const button = document.createElement("button");
        button.id = `postlike${blog.Post_Id}`;
        button.className = "like-btn";
        button.innerHTML = `
            <i class="fa fa-heart" aria-hidden="true"></i>
        `;
        
        // Like count
        const countp = document.createElement("p");
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
        const commentForm = document.createElement("form");
        commentForm.style = "padding: 10px; background: #fff; border-top: 1px solid #ddd;";
        commentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const comment = commentInput.value.trim();
            if (comment) {
                await postComment(post_id, commentInput, commentList);
            }
        });

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment...";
        commentInput.style = "width: calc(100% - 70px); padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;";

        const commentButton = document.createElement("button");
        commentButton.type = "submit";
        commentButton.textContent = "Post";
        commentButton.style = "padding: 8px 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor:pointer;";

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        // Comment list container
        const commentSection = document.createElement("div");
        commentSection.style = "max-height: 150px; overflow-y: auto; margin-top: 10px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;";
        const commentList = document.createElement("div");
        commentSection.appendChild(commentList);

        blogContainer.appendChild(commentForm);
        blogContainer.appendChild(commentSection);

        div.appendChild(blogContainer);
    });
}

// Function to fetch comments and show dialog
async function fetchAndShowComments(postId) {
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
async function postComment(postId, commentInput, commentList) {
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


function showCommentsDialog(comments) {
    const dialog = document.createElement("div");
    dialog.style = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; max-height: 300px; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow-y: auto; z-index: 1000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style = "position: absolute; top: 10px; right: 10px; background: #ff5f5f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
    closeButton.addEventListener("click", () => dialog.remove());

    dialog.appendChild(closeButton);

    if (comments.length > 0) {
        comments.forEach(comment => {
            const commentItem = document.createElement("div");
            commentItem.style = "padding: 10px 0; border-bottom: 1px solid #ddd;";

            // Comment text
            const commentText = document.createElement("div");
            commentText.textContent = `${comment.UserName}: ${comment.Comment_Text}`;
            commentItem.appendChild(commentText);

            // Comment time
            const commentTime = document.createElement("div");
            const formattedTime = new Date(comment.FormattedTimeComment).toLocaleString(); // Format the timestamp
            commentTime.textContent = `Posted on: ${formattedTime}`;
            commentTime.style = "font-size: 12px; color: #777; margin-top: 5px;";
            commentItem.appendChild(commentTime);

            dialog.appendChild(commentItem);
        });
    } else {
        const noComments = document.createElement("div");
        noComments.textContent = "No comments yet.";
        noComments.style = "padding: 10px 0; color: #777;";
        dialog.appendChild(noComments);
    }

    document.body.appendChild(dialog);
}

// Like the answer and update the likes count
const addLikes = async (post_id) => {
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
            likeBtn.disabled = true; // Disable the like button after clicking it

            // Increment the likes count on the page
            const countElement = likeBtn.nextElementSibling; // Get the like count paragraph
            let currentLikes = parseInt(countElement.innerText) || 0;
            countElement.innerText = currentLikes + 1; // Increment the like count
        }
    } catch (error) {
        console.error("Error on adding Likes to answer", error);
    }
}

// Adding scroll event to load more blogs when scrolled to the bottom
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 10) {
        fetchBlogs();
    }
});

// Initial fetch
fetchBlogs();
