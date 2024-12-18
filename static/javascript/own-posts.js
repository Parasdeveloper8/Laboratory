const apiUrl = "http://localhost:4900/my-posts"; // Replace with the actual API URL

// Function to fetch data from the API
async function fetchMyBlogs() {
    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Call the function to render blogs
        renderBlogs(data.data);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        document.getElementById("blogs").innerText = "Failed to Load Your Posts.";
    }
}

// Function to render blogs
function renderBlogs(blogs) {
    const div = document.getElementById("blogs");

    // Clear any existing content
    div.innerHTML = "";

    // Loop through the blogs and create HTML elements
    blogs.forEach(blog => {
        // Create a container for each blog
        const blogContainer = document.createElement("div");
        blogContainer.className = "blog-item";
        blogContainer.style = "width: 300px; margin: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);";


        // Create an image element below the email
        const imgWrapper = document.createElement("div");
        imgWrapper.style = "width: 100%; height: 200px; overflow: hidden;";

        const img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${blog.Base64string}`;
        img.alt = blog.Title; // Use the title as alt text
        img.style = "width: 100%; height: 100%; object-fit: cover;";   

        imgWrapper.appendChild(img);

        // Create a title element below the image
        const title = document.createElement("h3");
        title.textContent = blog.Title; // Assuming the API provides a "title" field
        title.style = "padding: 10px; margin: 0; font-size: 16px; text-align: center; color: #333; background: #f9f9f9;";

        // Append the image wrapper and title to the blog container
        blogContainer.appendChild(imgWrapper);
        blogContainer.appendChild(title);

        // Append the blog container to the main div
        div.appendChild(blogContainer);
    });
}

// Call the fetchBlogs function to load data
fetchMyBlogs();
