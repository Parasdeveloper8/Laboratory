const apiUrl = 'http://localhost:4900/profile-data';

// Modal elements
const modal = document.getElementById('edit-modal');
const closeModal = document.getElementsByClassName('close')[0];
const submitButton = document.getElementById('submit-edit');
const editInputName = document.getElementById('edit-input-name');
const editInputRole = document.getElementById('edit-input-role');

// Variable to store which profile is being edited
let currentProfile = null;

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
        
        // Profile photo
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('profile-photo-container');
        
        if (profile.Profile_image && profile.Profile_image.trim() !== '') {
          photoContainer.innerHTML = `<img src=data:image/jpeg;base64,${profile.Profile_image} alt="Profile Photo" class="profile-photo">`;
        } else {
          photoContainer.innerHTML = `<div class="placeholder-photo">No Image</div>`;
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
        actionButton.innerHTML = "Change Profile Image";
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

        // Action button for changing profile name and role
        const changeProfileButton = document.createElement('button');
        changeProfileButton.classList.add('change-profile-button');
        changeProfileButton.innerHTML = "Change Profile";
        changeProfileButton.addEventListener('click', () => {
          openEditModal(profile);
        });
        profileContainer.appendChild(changeProfileButton);

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

// Open the modal for editing name or role
function openEditModal(profile) {
  currentProfile = profile;

  // Set input values based on the profile data
  editInputName.value = profile.Name || '';
  editInputRole.value = profile.Role || '';

  // Show the modal
  modal.style.display = 'block';
}

// Close the modal
closeModal.onclick = () => {
  modal.style.display = 'none';
};

// Submit the new values (name and role)
submitButton.addEventListener('click', async () => {
  const newName = editInputName.value.trim() || 'Default Name';
  const newRole = editInputRole.value.trim() || 'Default Role';

  const updateData = {
    Name: newName,
    Role: newRole
  };

  try {
    const response = await fetch(`http://localhost:4900/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( updateData)
    });

    if (response.ok) {
      alert('Profile updated successfully!');
      modal.style.display = 'none'; // Close the modal
      fetchProfileData(); // Refresh the profile data
    } else {
      alert('Failed to update profile');
    }
  } catch (error) {
    console.error(error);
    alert('Error updating profile');
  }
});

// Call the function to fetch and display profile data
fetchProfileData();
