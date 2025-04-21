//All Html elements from addImage.html
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const imagePreview = document.getElementById('image-preview');
if (dropArea) {
    // Prevent default behavior for drag events
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#e1e1e1';
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '#f4f4f4';
    });
    dropArea.addEventListener('drop', (event) => {
        if (!event.dataTransfer)
            return;
        event.preventDefault();
        dropArea.style.backgroundColor = '#f4f4f4';
        handleFile(event.dataTransfer.files[0]);
    });
    // Open file input dialog on click
    dropArea.addEventListener('click', () => {
        if (!uploadButton)
            return;
        if (!uploadButton.style.display || uploadButton.style.display === 'none') {
            if (!fileInput)
                return;
            fileInput.click();
        }
    });
}
if (fileInput !== null) {
    // Handle file input change
    fileInput.addEventListener('change', () => {
        var _a;
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0]; // Safe access using optional chaining
        if (file) {
            handleFile(file);
        }
        else {
            console.error("No file selected.");
        }
    });
}
function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            if (!imagePreview)
                return;
            // Clear the preview area and insert an <img> element
            imagePreview.innerHTML = ''; // Clear previous content
            const img = document.createElement('img');
            if (typeof reader.result === "string") {
                img.src = reader.result;
            }
            else {
                console.error("FileReader result is not a string.");
            }
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain'; // Ensures the image fits inside the container
            imagePreview.appendChild(img);
            if (!uploadButton)
                return;
            uploadButton.style.display = 'inline-block'; // Show upload button
        };
        reader.readAsDataURL(file);
    }
    else {
        alert('Please select a valid image file.');
    }
}

