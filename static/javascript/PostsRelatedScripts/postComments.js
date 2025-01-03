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
module.exports = postComment;