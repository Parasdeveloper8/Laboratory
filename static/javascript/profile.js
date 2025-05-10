var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//get profile id from path params
const pathParts = window.location.pathname.split("/");
const profileId = pathParts[2];
const apiUrl = `http://localhost:4900/profile-data/${profileId}`;
let whoIs;
//Ids from profile.html
const header = document.getElementById("header");
if (header.value == "true") {
    whoIs = true;
    console.log(whoIs);
}
else {
    whoIs = false;
    console.log(whoIs);
}
let hasRendered = false;
// Fetch profile data from the API
function fetchProfileData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (hasRendered)
            return;
        try {
            const response = yield fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const responseData = yield response.json();
            // console.log(responseData); // Log the response data to see the structure
            // Check if the 'data' array exists and contains profiles
            if (responseData) {
                hasRendered = true;
                const profilesContainer = document.getElementById('profiles-container');
                if (profilesContainer)
                    profilesContainer.innerHTML = ''; // Clear any previous content
                const profile = responseData.data;
                //console.log(profile);
                // Create a container for each profile
                const profileContainer = document.createElement('div');
                profileContainer.classList.add('profile-container');
                const imgfunc = function cimg() {
                    if (profile.Profile_image && profile.Profile_image.trim() !== " ") {
                        alert('Redirecting to change image page...');
                        window.location.href = "/add-image-page";
                    }
                    else {
                        alert('Redirecting to add image page...');
                        window.location.href = "/add-image-page";
                    }
                };
                // Profile photo
                const photoContainer = document.createElement('div');
                photoContainer.classList.add('profile-photo-container');
                if (profile.Profile_image && profile.Profile_image.trim() !== '') {
                    photoContainer.innerHTML = `<img src=data:image/jpeg;base64,${profile.Profile_image} alt="Profile Photo" class="profile-photo">
           <button class='fa fa-pencil pencil' aria-hidden='true' ${whoIs ? '' : 'disabled'}></button>
          `;
                }
                else {
                    photoContainer.innerHTML = `<img src="/static/Images/avatar_face_only.png" alt="default-img" class="profile-photo">
           <button class='fa fa-pencil pencil' aria-hidden='true' ${whoIs ? '' : 'disabled'}></button>
          `;
                }
                // Attach event listener for the pencil button
                const pencilButton = photoContainer.querySelector('.pencil');
                if (!pencilButton)
                    return;
                pencilButton.addEventListener('click', imgfunc);
                profileContainer.appendChild(photoContainer);
                // Name
                const nameContainer = document.createElement('div');
                nameContainer.classList.add('profile-name-container');
                const nameElement = document.createElement('div');
                nameElement.classList.add('profile-name');
                nameElement.innerHTML = `<p>${profile.Name || 'No name available'}</p>`;
                nameContainer.appendChild(nameElement);
                profileContainer.appendChild(nameContainer);
                // About
                const aboutContainer = document.createElement('div');
                aboutContainer.classList.add('about-container');
                aboutContainer.innerHTML = `<p>${profile.About}</p>`;
                profileContainer.appendChild(aboutContainer);
                // Email
                const emailElement = document.createElement('div');
                emailElement.classList.add('profile-email');
                emailElement.textContent = `${whoIs ? profile.Email : " "}`;
                profileContainer.appendChild(emailElement);
                // Role
                const roleContainer = document.createElement('div');
                roleContainer.classList.add('profile-role-container');
                const roleElement = document.createElement('div');
                roleElement.classList.add('profile-role');
                roleElement.textContent = profile.Role || 'No role available';
                roleContainer.appendChild(roleElement);
                profileContainer.appendChild(roleContainer);
                if (whoIs) {
                    // Change Profile button
                    const changeProfile = document.createElement('button');
                    changeProfile.classList.add('change-profile-button');
                    changeProfile.innerHTML = "Change Profile";
                    changeProfile.addEventListener('click', () => {
                        window.location.href = "/change-profile-page";
                    });
                    profileContainer.appendChild(changeProfile);
                }
                if (whoIs) {
                    // Delete Image button
                    const deleteImageButton = document.createElement('button');
                    deleteImageButton.classList.add('delete-image-button');
                    deleteImageButton.innerHTML = "Delete Photo";
                    deleteImageButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                        if (profile.Email) {
                            const confirmDelete = confirm("Are you sure you want to delete this image?");
                            if (confirmDelete) {
                                try {
                                    const deleteImageApiUrl = `http://localhost:4900/delete-image/${profile.Email}`; // API for deleting the image
                                    const deleteResponse = yield fetch(deleteImageApiUrl, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    });
                                    if (deleteResponse.ok) {
                                        alert('Image deleted successfully');
                                        fetchProfileData(); // Refresh the profile data
                                    }
                                    else {
                                        alert('Failed to delete the image');
                                    }
                                }
                                catch (error) {
                                    console.error('Error deleting the image:', error);
                                    alert('An error occurred while deleting the image');
                                }
                            }
                        }
                        else {
                            alert('Email not available for this profile');
                        }
                    }));
                    profileContainer.appendChild(deleteImageButton);
                }
                if (whoIs) {
                    const mpost = document.createElement("a");
                    mpost.href = "/own-posts-page";
                    mpost.className = 'text-decoration-none';
                    mpost.innerHTML = `<p class='text-center fs-4 text-body-emphasis'>My Posts <i class="fa-solid fa-arrow-right"></i></p>`;
                    profileContainer.appendChild(mpost);
                }
                if (whoIs) {
                    const mques = document.createElement("a");
                    mques.href = "/myques";
                    mques.className = 'text-decoration-none';
                    mques.innerHTML = `<p class='text-center fs-4 text-body-emphasis'>My Ques <i class="fa-solid fa-arrow-right"></i></p>`;
                    profileContainer.appendChild(mques);
                }
                // Append the profile container to the profiles container in HTML
                if (profilesContainer)
                    profilesContainer.appendChild(profileContainer);
            }
            else {
                console.error('No profile data found');
                const profilesCont = document.getElementById('profiles-container');
                if (profilesCont)
                    profilesCont.textContent = 'No profiles available';
            }
        }
        catch (error) {
            console.error(error);
            const profilesCont = document.getElementById('profiles-container');
            if (profilesCont)
                profilesCont.textContent = 'Error loading profile data';
        }
    });
}
// Call the function to fetch and display profile data
fetchProfileData();
export {};
