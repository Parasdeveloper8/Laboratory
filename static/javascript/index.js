const apiUrl = "http://localhost:4900/blogs"; // Replace with the actual API URL

// Function to fetch data from the API
async function fetchBlogs() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderBlogs(data.data);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        document.getElementById("blogs").innerText = "Failed to load blogs.";
    }
}

// Function to render blogs
function renderBlogs(blogs) {
    const div = document.getElementById("blogs");
    div.innerHTML = "";

    blogs.forEach(blog => {
        const post_id = blog.Post_Id;
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";
        blogContainer.style = "width: 300px; margin: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative; top:10vh;";

        const topBar = document.createElement("div");
        topBar.style = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const emailBar = document.createElement("div");
        emailBar.style = "display: flex; align-items: center;";

        const emailIcon = document.createElement("img");
        emailIcon.src = `data:image/jpeg;base64,${blog.User_Image}`;
        emailIcon.alt = "User Icon";
        emailIcon.style = "width: 20px; height: 20px; margin-right: 8px;";

        emailBar.appendChild(emailIcon);
        emailBar.appendChild(document.createTextNode(blog.Email));

        const uploadedTime = document.createElement("div");
        uploadedTime.textContent = blog.FormattedTime;
        uploadedTime.style = "font-size: 12px; color: #777; text-align: right;";

        topBar.appendChild(emailBar);
        topBar.appendChild(uploadedTime);
        blogContainer.appendChild(topBar);

        const imgWrapper = document.createElement("div");
        imgWrapper.style = "width: 100%; height: 200px; overflow: hidden;";

        const img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${blog.Base64string}`;
        img.alt = blog.Title;
        img.style = "width: 100%; height: 100%; object-fit: cover;";
        imgWrapper.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = blog.Title;
        title.style = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";
        blogContainer.appendChild(imgWrapper);
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
        commentButton.style = "padding: 8px 12px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;";

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

// Function to show comments in a dialog
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
            commentItem.textContent = `${comment.Email}: ${comment.Comment_Text}`;
            commentItem.style = "padding: 10px 0; border-bottom: 1px solid #ddd;";
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

// Call the fetchBlogs function to fetch and display blogs
fetchBlogs();
