// API URL (replace with your actual API endpoint)
const apiUrl = 'https://localhost:4900/profile-data';

// Fetch profile data from the API
async function fetchProfileData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const data = await response.json();

    // Populate profile details
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-email').textContent = data.email;

    const photoContainer = document.getElementById('profile-photo-container');
    const actionButton = document.getElementById('image-action-button');

    if (data.photo && data.photo.trim() !== '') {
      // Show the profile photo
      photoContainer.innerHTML = `<img src="${data.photo}" alt="Profile Photo" class="profile-photo">`;
      actionButton.textContent = 'Change Image';
    } else {
      // Show a placeholder for missing photo
      photoContainer.innerHTML = `<div class="placeholder-photo">No Image</div>`;
      actionButton.textContent = 'Add Image';
    }

    // Show the action button
    actionButton.style.display = 'inline-block';
    actionButton.addEventListener('click', () => {
      if (data.photo && data.photo.trim() !== '') {
        alert('Redirecting to change image page...');
        // Add logic to change the image
      } else {
        alert('Redirecting to add image page...');
        // Add logic to add a new image
      }
    });
  } catch (error) {
    console.error(error);
    document.getElementById('profile-name').textContent = 'Error loading profile';
    document.getElementById('profile-email').textContent = '';
  }
}

// Call the function to fetch and display profile data
fetchProfileData();