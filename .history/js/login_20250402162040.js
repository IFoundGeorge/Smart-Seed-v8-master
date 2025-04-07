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

function validatePassword(password) {
  const errors = [];

  // Check if password is at least 8 characters long
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  // Check if password contains at least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter.");
  }
  // Check if password contains at least 1 number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least 1 number.");
  }
  // Check if password contains at least 1 special character
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least 1 special character.");
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

  if (!document.getElementById("captcha-checkbox").checked) {
    alert("Please verify the CAPTCHA.");
    return;
  }

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Get password errors
  const passwordErrors = validatePassword(password);

  // If there are any password errors, show them
  if (passwordErrors.length > 0) {
    alert(passwordErrors.join("\n"));
    return;
  }

  const hardcodedEmail = "admin@email.com";
  const hardcodedPasswordHash = "047658c84a2952ac862f1001773d02363834267f";
  const hashedPassword = sha1(password);

  if (email === hardcodedEmail && hashedPassword === hardcodedPasswordHash) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("captcha-modal");
  if (event.target === modal) {
    closeCaptchaModal();
  }
};
