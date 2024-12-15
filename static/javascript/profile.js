    // API URL (replace with your actual API endpoint)
    const apiUrl = 'https://api.example.com/profile';

    // Fetch profile data from the API
    async function fetchProfileData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();

        // Update the profile details dynamically
        document.getElementById('profile-photo').src = data.photo;
        document.getElementById('profile-name').textContent = data.name;
        document.getElementById('profile-email').textContent = data.email;
      } catch (error) {
        console.error(error);
        document.getElementById('profile-name').textContent = 'Error loading profile';
        document.getElementById('profile-email').textContent = '';
      }
    }

    // Call the function to fetch and display profile data
    fetchProfileData();