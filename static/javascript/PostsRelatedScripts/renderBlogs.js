const {postComment} = require("./postComments.js");
const {fetchAndShowComments} = require("./fetchShowComments.js");
// Function to render blogs
function renderBlogs(blogs) {
    const div = document.getElementById("blogs");

    blogs.forEach(blog => {
        const post_id = blog.Post_Id;
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";
        blogContainer.style = "width: 300px; margin: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); position: relative; top:10vh;";

        const topBar = document.createElement("div");
        topBar.style = "display: flex; justify-content: space-between; padding: 8px; background: #f9f9f9; color: #333; font-size: 14px;";

        const nameBar = document.createElement("div");
        nameBar.style = "display: flex; align-items: center;";

        const emailIcon = document.createElement("img");
        if (blog.User_Image == null){
            emailIcon.src = "static/Images/avatar_face_only.png";
        }else{
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
module.exports = renderBlogs;