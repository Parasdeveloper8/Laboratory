const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const imagePreview = document.getElementById('image-preview');

// Prevent default behavior for drag events
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#e1e1e1';
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = '#f4f4f4';
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = '#f4f4f4';
  handleFile(event.dataTransfer.files[0]);
});

// Open file input dialog on click
dropArea.addEventListener('click', () => {
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
      // Clear the preview area and insert an <img> element
      imagePreview.innerHTML = ''; // Clear previous content
      const img = document.createElement('img');
      img.src = reader.result;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      img.style.objectFit = 'contain'; // Ensures the image fits inside the container
      imagePreview.appendChild(img);
      uploadButton.style.display = 'inline-block'; // Show upload button
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select a valid image file.');
  }
}

