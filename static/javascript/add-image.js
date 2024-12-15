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
  fileInput.click();
});

// Handle file input change
fileInput.addEventListener('change', () => {
  handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.style.backgroundImage = `url(${reader.result})`;
      imagePreview.textContent = '';
      uploadButton.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select a valid image file.');
  }
}


