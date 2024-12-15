// API URL (replace with your actual API endpoint)
const apiUrl = 'http://localhost:4900/profile-data';

// Fetch profile data from the API
async function fetchProfileData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const responseData = await response.json();

    console.log(responseData);  // Log the response data to see the structure

    // Check if the 'data' array exists and contains profiles
    if (responseData && responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      const profilesContainer = document.getElementById('profiles-container');
      profilesContainer.innerHTML = ''; // Clear any previous content

      // Loop through each profile in the data array
      for (let i = 0; i < responseData.data.length; i++) {
        const profile = responseData.data[i];

        // Create a container for each profile
        const profileContainer = document.createElement('div');
        profileContainer.classList.add('profile-container');
        
        // Name, Email, and Role
        const nameElement = document.createElement('div');
        nameElement.classList.add('profile-name');
        nameElement.innerHTML = `<p>${profile.Name || 'No name available'}</p>`;
        profileContainer.appendChild(nameElement);

        const emailElement = document.createElement('div');
        emailElement.classList.add('profile-email');
        emailElement.textContent = profile.Email || 'No email available';
        profileContainer.appendChild(emailElement);

        const roleElement = document.createElement('div');
        roleElement.classList.add('profile-role');
        roleElement.textContent = profile.Role || 'No role available';
        profileContainer.appendChild(roleElement);

        // Profile photo
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('profile-photo-container');
        
        if (profile.Profile_image && profile.Profile_image.trim() !== '') {
          // Show the profile photo using Base64 string if available
          photoContainer.innerHTML = `<img src="data:image/jpeg;base64,${profile.Profile_image}" alt="Profile Photo" class="profile-photo">`;
        } else {
          // Show a placeholder for missing photo
          photoContainer.innerHTML = `<div class="placeholder-photo">No Image</div>`;
        }
        profileContainer.appendChild(photoContainer);

        // Action button for changing or adding image
        const actionButton = document.createElement('button');
        actionButton.classList.add('image-action-button');
        actionButton.textContent = profile.Profile_image ? 'Change Image' : 'Add Image';
        actionButton.addEventListener('click', () => {
          if (profile.Profile_image && profile.Profile_image.trim() !== '') {
            alert('Redirecting to change image page...');
            // Add logic to change the image
          } else {
            alert('Redirecting to add image page...');
            // Add logic to add a new image
          }
        });
        profileContainer.appendChild(actionButton);

        // Append the profile container to the profiles container in HTML
        profilesContainer.appendChild(profileContainer);
      }
    } else {
      console.error('No profile data found');
      document.getElementById('profiles-container').textContent = 'No profiles available';
    }

  } catch (error) {
    console.error(error);
    document.getElementById('profiles-container').textContent = 'Error loading profile data';
  }
}

// Call the function to fetch and display profile data
fetchProfileData();





