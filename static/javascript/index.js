
const apiUrl = "http://localhost:4900/blogs"; // Replace with the actual API URL

// Function to fetch data from the API
async function fetchBlogs() {
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
        document.getElementById("blogs").innerText = "Failed to load blogs.";
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

        // Create an image element
        const img = document.createElement("img");
        img.src =`data:image/jpeg;base64,${blog.base64string}`;
        img.alt = blog.title; // Use the title as alt text
        img.className = "blog-image";

        // Create a title element
        const title = document.createElement("h3");
        title.textContent = blog.title; // Assuming the API provides a "title" field
        title.className = "blog-title";

        // Append the image and title to the blog container
        blogContainer.appendChild(img);
        blogContainer.appendChild(title);

        // Append the blog container to the main div
        div.appendChild(blogContainer);
    });
}

// Call the fetchBlogs function to load data
fetchBlogs();
