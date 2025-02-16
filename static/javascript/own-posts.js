import { scrollFetch } from "./Reusable-functions/reusefuns.js";

const loader = document.getElementById('r-loader');
const failLoader = document.getElementById("f-loader");
loader.style.display = 'block';
failLoader.style.display = 'none';
let page = 1;
let limit = 3;
let row= 0;
let isLoading = false; // To prevent multiple fetches at once
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
        loader.style.display = 'none';
        row++;
        page++;
        renderBlogs(data.data);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        loader.style.display = 'none';
        failLoader.style.display='block';
    }finally {
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

// Function to render blogs
function renderBlogs(blogs) {
    const div = document.getElementById("blogs");

    blogs.forEach(blog => {
        const post_id = blog.Post_id;
        console.log(blog.Formattedtime);
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";

        // Create the top bar
        const topBar = document.createElement("div");
        topBar.style = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        // Uploaded time
        const uploadedTime = document.createElement("div");
        uploadedTime.textContent = blog.Formattedtime;
        uploadedTime.style = "font-size: 12px; color: #777; text-align: right;";

        // Trash bin icon (delete button)
        const trashBinIcon = document.createElement("div");
        trashBinIcon.innerHTML = "🗑️"; // Trash bin emoji
        trashBinIcon.style = "cursor: pointer; font-size: 20px; color: #333;";

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
        const mediaWrapper = document.createElement("div");
        mediaWrapper.style = "width: 100%; height: 200px; overflow: hidden;";

        const base64String = blog.Base64string;
        if (base64String.startsWith("/9j") || base64String.startsWith("iVBORw")) {
            // Render as an image
            const img = document.createElement("img");
            img.src = `data:image/jpeg;base64,${base64String}`;
            img.alt = blog.Title;
            img.style = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(img);
        } else {
            // Render as a video
            const video = document.createElement("video");
            video.src = `data:video/mp4;base64,${base64String}`;
            video.controls = true;
            video.style = "width: 100%; height: 100%; object-fit: cover;";
            mediaWrapper.appendChild(video);
        }

        // Title
        const title = document.createElement("h3");
        title.textContent = blog.Title;
        title.style = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        // Add "View Comments" link
        const viewCommentsLink = document.createElement("a");
        viewCommentsLink.href = "#";
        viewCommentsLink.textContent = "View Comments";
        viewCommentsLink.style = "display: block; text-align: center; margin: 10px 0; color: #007bff; cursor: pointer;";
        viewCommentsLink.addEventListener("click", (e) => {
            e.preventDefault();
            fetchAndShowComments(post_id);
        });

        // Append everything to the blog container
        blogContainer.appendChild(mediaWrapper);
        blogContainer.appendChild(title);
        blogContainer.appendChild(viewCommentsLink);

        // Append the blog container to the main div
        div.appendChild(blogContainer);
    });
}

// Function to delete the blog post
async function deleteBlog(postId) {
    try {
        const response = await fetch(`http://localhost:4900/delete-post/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Reload blogs after successful deletion
        fetchMyBlogs();
    } catch (error) {
        console.error("Error deleting blog:", error);
    }
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

// Function to show comments dialog
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

// Function to show delete confirmation modal
function showDeleteConfirmation(postId) {
    const modal = document.createElement("div");
    modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;";

    const confirmationBox = document.createElement("div");
    confirmationBox.style = "background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; width: 300px;";

    const message = document.createElement("p");
    message.textContent = "Are you sure you want to delete this post?";
    message.style = "font-size: 16px; color: #333; margin-bottom: 20px;";

    const buttonContainer = document.createElement("div");
    buttonContainer.style = "display: flex; justify-content: space-around;";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style = "background-color: #ccc; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    cancelButton.addEventListener("click", () => modal.remove());

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style = "background-color: #ff5f5f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
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
