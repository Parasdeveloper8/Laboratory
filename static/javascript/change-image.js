const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const changeButton = document.getElementById('change-button'); // Add this line

// Prevent default behavior for drag events
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#e1e1e1';
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = '#f4f4f4'; // Reset background
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#f4f4f4';
  handleFile(event.dataTransfer.files[0]);
});


// Open file input dialog on click
dropArea.addEventListener('click', () => {
  // Check if the user wants to upload a new file
  if (!uploadButton.style.display || uploadButton.style.display === 'none') {
    fileInput.click();
  }
});

// Handle file input change
fileInput.addEventListener('change', () => {
  handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      // Update the preview area with the uploaded image
      imagePreview.style.backgroundImage = `url(${reader.result})`;
      imagePreview.textContent = '';
      changeButton.style.display = 'inline-block'; // Show upload button
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select a valid image file.');
  }
}
