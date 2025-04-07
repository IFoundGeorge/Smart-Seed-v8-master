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
  const userAnswer = document.getElementById("captcha-answer").value;
  const correctAnswer = document
    .getElementById("captcha-answer")
    .getAttribute("data-answer");

  if (userAnswer == correctAnswer) {
    captchaVerified = true;
    document.getElementById("login-button").disabled = false; // Enable login button
    document.getElementById("captcha-checkbox").checked = true; // Mark CAPTCHA checkbox
    showNotification("CAPTCHA verified successfully! ✅");
    closeCaptchaModal();
  } else {
    showNotification("Incorrect CAPTCHA. Try again! ❌");
  }
}

function loginUser(event) {
  event.preventDefault(); // Prevent form submission

  if (!captchaVerified) {
    showNotification("⚠️ Please complete the CAPTCHA before logging in!");
    return;
  }

  // 🚀 Login success simulation (replace this with real authentication)
  alert("Logging in...");
}

function loginAsGuest() {
  window.location.href = "guest/index.html";
}

function showNotification(message) {
  const notificationBar = document.getElementById("notification-bar");
  notificationBar.textContent = message;
  notificationBar.style.display = "block";

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notificationBar.style.display = "none";
  }, 3000);
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character.");
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

  console.log("Login attempted");

  if (!document.getElementById("captcha-checkbox").checked) {
    console.log("CAPTCHA not verified");
    showNotification("Please verify the CAPTCHA.");
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const passwordErrors = validatePassword(password);

  if (passwordErrors.length > 0) {
    console.log("Password errors:", passwordErrors);
    showNotification(passwordErrors.join(" "));
    return;
  }

  const hardcodedEmail = "admin@email.com";
  const hardcodedPassword = "Password123!";

  if (email === hardcodedEmail && password === hardcodedPassword) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    console.log("Invalid login");
    showNotification("Invalid email or password.");
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("captcha-modal");
  if (event.target === modal) {
    closeCaptchaModal();
  }
};
