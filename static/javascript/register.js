//Ids from registerpage.html
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        const password = document.getElementById('password');
        const passValue = password.value;
        const checkPassword = document.getElementById('checkPassword');
        const checkPassValue = checkPassword.value;
        const passwordError = document.getElementById('passwordError');
        const btn = document.getElementById('sbtn');
        if (passValue !== checkPassValue) {
            event.preventDefault(); // Prevent form submission
            btn.disabled = true;
            if (!passwordError)
                return;
            passwordError.textContent = "Passwords do not match.";
            passwordError.style.display = "block";
        }
        else {
            // If passwords match, remove error and enable the button
            btn.disabled = false;
            if (!passwordError)
                return;
            passwordError.textContent = "";
            passwordError.style.display = "none";
        }
    });
}
export {};
