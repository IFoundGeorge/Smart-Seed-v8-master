document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".message a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll("form").forEach((form) => {
        form.classList.toggle("hidden");
      });
    });
  });
});

let correctAnswer;

function showCaptchaModal() {
  const captchaCheckbox = document.getElementById("captcha-checkbox");
  captchaCheckbox.checked = false;
  document.getElementById("login-button").disabled = true;

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  correctAnswer = num1 + num2;
  document.getElementById(
    "math-problem"
  ).innerText = `What is ${num1} + ${num2}?`;
  document.getElementById("captcha-modal").style.display = "block";
}

function closeCaptchaModal() {
  document.getElementById("captcha-modal").style.display = "none";
}

function verifyCaptcha() {
  const userAnswer = parseInt(
    document.getElementById("captcha-answer").value,
    10
  );
  if (userAnswer === correctAnswer) {
    alert("CAPTCHA verified successfully!");
    document.getElementById("captcha-checkbox").checked = true;
    enableLoginButton();
    closeCaptchaModal();
  } else {
    alert("Incorrect answer. Please try again.");
    document.getElementById("captcha-answer").value = "";
    showCaptchaModal();
  }
}

function isValidLogin(inputString) {
  // Check for minimum 8 words
  const wordCount = inputString.trim().split(/\s+/).length;
  if (wordCount < 8) {
    return "Error: Input must contain at least 8 words.";
  }
  // Check for capital letters
  if (/[A-Z]/.test(inputString)) {
    return "Error: Input must not contain capital letters.";
  }
  // Check for numbers
  if (/\d/.test(inputString)) {
    return "Error: Input must not contain numbers.";
  }
  // Check for special characters
  const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (specialCharacters.test(inputString)) {
    return "Error: Input must not contain special characters.";
  }
  return "Login successful!";
}
// Example usage
const userInput = prompt("Enter your login input:");
const result = isValidLogin(userInput);
alert(result);

function enableLoginButton() {
  const password = document.getElementById("login-password").value;
  const captchaChecked = document.getElementById("captcha-checkbox").checked;
  const loginButton = document.getElementById("login-button");

  // Enable login button if password is valid and CAPTCHA is checked
  if (validatePassword(password).length === 0 && captchaChecked) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

function loginUser(event) {
  event.preventDefault();

  // Reference to the error message element
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = ""; // Clear previous messages

  // Check if CAPTCHA is verified
  if (!document.getElementById("captcha-checkbox").checked) {
    errorMessageElement.textContent = "Please verify the CAPTCHA.";
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  // Validate password
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    errorMessageElement.textContent = passwordErrors.join(" ");
    return;
  }

  // Hardcoded credentials for demonstration purposes
  const hardcodedEmail = "admin@email.com";
  const hardcodedPassword = "Password123!";

  // Check credentials
  if (email === hardcodedEmail && password === hardcodedPassword) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    errorMessageElement.textContent = "Invalid email or password."; // Show error if credentials don't match
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("captcha-modal");
  if (event.target === modal) {
    closeCaptchaModal();
  }
};
