const apiUrl = 'http://localhost:4900/profile-data';

// Fetch profile data from the API
async function fetchProfileData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    const responseData = await response.json();

    console.log(responseData); // Log the response data to see the structure

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

        // Profile photo
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('profile-photo-container');

        if (profile.Profile_image && profile.Profile_image.trim() !== '') {
          photoContainer.innerHTML = `<img src=data:image/jpeg;base64,${profile.Profile_image} alt="Profile Photo" class="profile-photo">`;
        } else {
          photoContainer.innerHTML = `<div class="placeholder-photo"><img src="static/Images/avatar_face_only.png" alt="default-img" class="profile-photo"></div>`;
        }
        profileContainer.appendChild(photoContainer);

        // Name
        const nameContainer = document.createElement('div');
        nameContainer.classList.add('profile-name-container');
        const nameElement = document.createElement('div');
        nameElement.classList.add('profile-name');
        nameElement.innerHTML = `<p>${profile.Name || 'No name available'}</p>`;
        nameContainer.appendChild(nameElement);
        profileContainer.appendChild(nameContainer);

        // Email
        const emailElement = document.createElement('div');
        emailElement.classList.add('profile-email');
        emailElement.textContent = profile.Email || 'No email available';
        profileContainer.appendChild(emailElement);

        // Role
        const roleContainer = document.createElement('div');
        roleContainer.classList.add('profile-role-container');
        const roleElement = document.createElement('div');
        roleElement.classList.add('profile-role');
        roleElement.textContent = profile.Role || 'No role available';
        roleContainer.appendChild(roleElement);
        profileContainer.appendChild(roleContainer);

        // Action button for changing or adding image
        const actionButton = document.createElement('button');
        actionButton.classList.add('image-action-button');
        actionButton.innerHTML = "Change Photo";

        actionButton.addEventListener('click', () => {
          if (profile.Profile_image && profile.Profile_image.trim() !== '') {
            alert('Redirecting to change image page...');
            window.location.href = "/add-image-page";
          } else {
            alert('Redirecting to add image page...');
            window.location.href = "/add-image-page";
          }
        });
        profileContainer.appendChild(actionButton);

        // Change Profile button
        const changeProfile = document.createElement('button');
        changeProfile.classList.add('change-profile-button');
        changeProfile.innerHTML = "Change Profile";
        changeProfile.addEventListener('click', () => {
          window.location.href = "/change-profile-page";
        });
        profileContainer.appendChild(changeProfile);

        // Delete Image button
        const deleteImageButton = document.createElement('button');
        deleteImageButton.classList.add('delete-image-button');
        deleteImageButton.innerHTML = "Delete Photo";

        deleteImageButton.addEventListener('click', async () => {
          if (profile.Email) {
            const confirmDelete = confirm("Are you sure you want to delete this image?");
            if (confirmDelete) {
              try {
                const deleteImageApiUrl = `http://localhost:4900/delete-image/${profile.Email}`; // API for deleting the image

                const deleteResponse = await fetch(deleteImageApiUrl, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });

                if (deleteResponse.ok) {
                  alert('Image deleted successfully');
                  fetchProfileData(); // Refresh the profile data
                } else {
                  alert('Failed to delete the image');
                }
              } catch (error) {
                console.error('Error deleting the image:', error);
                alert('An error occurred while deleting the image');
              }
            }
          } else {
            alert('Email not available for this profile');
          }
        });
        profileContainer.appendChild(deleteImageButton);

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