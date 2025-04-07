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

let correctAnswer = null;
let captchaVerified = false;

function showCaptchaModal() {
  const captchaCheckbox = document.getElementById("captcha-checkbox");
  captchaCheckbox.checked = false; // Ensure CAPTCHA is unchecked when modal opens
  captchaVerified = false;
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

  if (!captchaVerified) {
    document.getElementById("captcha-checkbox").checked = false; // Ensure it stays unchecked
  }
}

function verifyCaptcha() {
  const userAnswer = document.getElementById("captcha-answer").value.trim();

  if (parseInt(userAnswer) === correctAnswer) {
    captchaVerified = true;
    document.getElementById("login-button").disabled = false; // Enable login button
    document.getElementById("captcha-checkbox").checked = true; // Mark CAPTCHA checkbox
    showNotification("✅ CAPTCHA verified successfully!");
    closeCaptchaModal();
  } else {
    showNotification("❌ Incorrect CAPTCHA. Try again!");
  }
}

function loginUser(event) {
  event.preventDefault(); // Prevent form submission

  if (!captchaVerified) {
    showNotification("⚠️ Please complete the CAPTCHA before logging in!");
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const passwordErrors = validatePassword(password);

  if (passwordErrors.length > 0) {
    showNotification(passwordErrors.join(" "));
    return;
  }

  const hardcodedEmail = "admin@email.com";
  const hardcodedPassword = "Password123!";

  if (email === hardcodedEmail && password === hardcodedPassword) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    showNotification("❌ Invalid email or password.");
  }
}

function loginAsGuest() {
  window.location.href = "guest/index.html";
}

function showNotification(message) {
  const notificationBar = document.getElementById("notification-bar");
  notificationBar.textContent = message;
  notificationBar.style.display = "block";

  setTimeout(() => {
    notificationBar.style.display = "none";
  }, 3000);
}

function validatePassword(password) {
  const errors = [];

  if (!captchaVerified) {
    event.preventDefault(); // Stop form submission
    showNotification("⚠️ Please verify the CAPTCHA before logging in!");
    return false;
  }

  if (password.length < 8)
    errors.push("Password must be at least 8 characters.");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain at least one uppercase letter.");
  if (!/[0-9]/.test(password))
    errors.push("Password must contain at least one number.");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push("Password must contain at least one special character.");
  return errors;
}

function enableLoginButton() {
  const password = document.getElementById("login-password").value;
  const captchaChecked = document.getElementById("captcha-checkbox").checked;
  const loginButton = document.getElementById("login-button");

  if (validatePassword(password).length === 0 && captchaChecked) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("captcha-modal");
  if (event.target === modal) {
    closeCaptchaModal();
  }
};
