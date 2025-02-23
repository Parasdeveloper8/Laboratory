//Ids from registerpage.html
const registerForm:HTMLElement | null = document.getElementById('registerForm');
if(registerForm){
registerForm.addEventListener('submit', function(event) {
    const password:HTMLElement | null = document.getElementById('password');
    const passValue = (password as HTMLInputElement).value;

    const checkPassword:HTMLElement | null = document.getElementById('checkPassword');
    const checkPassValue = (checkPassword as HTMLInputElement).value;

    const passwordError:HTMLElement | null = document.getElementById('passwordError');
    const btn:HTMLElement | null = document.getElementById('sbtn');
    
    if (passValue !== checkPassValue) {
        event.preventDefault();  // Prevent form submission
        (btn as HTMLButtonElement).disabled = true;
        if(!passwordError) return;
        passwordError.textContent = "Passwords do not match.";
        passwordError.style.display = "block";
    } else {
        // If passwords match, remove error and enable the button
        (btn as HTMLButtonElement).disabled = false;
        if(!passwordError) return;
        passwordError.textContent = "";
        passwordError.style.display = "none";
    }
});
}
export{}