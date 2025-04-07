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

function showNotification(message) {
  const notificationBar = document.getElementById("notification-bar");
  notificationBar.textContent = message;
  notificationBar.style.display = "block";

  setTimeout(() => {
    notificationBar.style.display = "none";
  }, 3000); // Hide after 3 seconds
}

function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("At least 8 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least 1 uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("At least 1 number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("At least 1 special character.");
  }

  return errors;
}

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

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  // Check password validity
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    showNotification("Password must have: " + passwordErrors.join(" "));
    return;
  }

  // Hardcoded credentials for testing
  const hardcodedEmail = "admin@email.com";
  const hardcodedPassword = "Password123!";

  if (email === hardcodedEmail && password === hardcodedPassword) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    showNotification("Invalid email or password."); // This now triggers on incorrect login
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("captcha-modal");
  if (event.target === modal) {
    closeCaptchaModal();
  }
};
