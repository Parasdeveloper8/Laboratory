const {renderBlogs} = require("./PostsRelatedScripts/renderBlogs.js");

const loader = document.getElementById('loader');
let page = 1;
let limit = 3;
let row= 0;
loader.style.display = 'block';
let isLoading = false; // To prevent multiple fetches at once

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('desktopSidebar');
    if (window.innerWidth > 768) {
        sidebar.style.display = 'block';
    }
});

// Function to fetch data from the API
async function fetchBlogs() {
    if (isLoading) return; // Prevent multiple fetches
    isLoading = true;
    try {
        const response = await fetch(`http://localhost:4900/blogs/${row}/${limit}`);
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
        document.getElementById("blogs").innerText = "Failed to load blogs.";
    } finally {//finally keyword,here,is used when promise is fulfilled or rejected
        isLoading = false; // Allow new fetch once the current one finishes
    }
}

// Call the fetchBlogs function to fetch and display blogs
 //Adding scroll event to window object 
window.addEventListener('scroll', () => { 
        const scrollPosition = window.scrollY + window.innerHeight; 
        const documentHeight = document.documentElement.scrollHeight; 
        
        if (scrollPosition >= documentHeight-50) {
            fetchBlogs();
        } 
    }); 
    fetchBlogs();