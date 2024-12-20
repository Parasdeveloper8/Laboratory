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
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";
        blogContainer.style = "width: 300px; margin: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative;";

        const topBar = document.createElement("div");
        topBar.style = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const emailBar = document.createElement("div");
        emailBar.style = "display: flex; align-items: center;";

        const emailIcon = document.createElement("img");
        emailIcon.src = `data:image/jpeg;base64,${blog.User_Image}`;
        emailIcon.alt = "Email Icon";
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

        // Comment form for backend handling
        const commentForm = document.createElement("form");
        commentForm.style = "padding: 10px; background: #fff; border-top: 1px solid #ddd;";
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const comment = commentInput.value.trim();
            if (comment) {
                try {
                    const response = await fetch(`http://localhost:4900/${blog.}/post-comments`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ comment }),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const newComment = await response.json();
                    const commentItem = document.createElement("div");
                    commentItem.textContent = newComment.comment;
                    commentItem.style = "padding: 5px 0; border-bottom: 1px solid #ddd;";
                    commentList.appendChild(commentItem);
                    commentInput.value = "";
                } catch (error) {
                    console.error("Error posting comment:", error);
                }
            }
        };

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

// Call the fetchBlogs function to fetch and display blogs
fetchBlogs();
