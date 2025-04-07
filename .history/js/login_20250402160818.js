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
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(password);
}

function enableLoginButton() {
  const password = document.getElementById("login-password").value;
  const captchaChecked = document.getElementById("captcha-checkbox").checked;
  const loginButton = document.getElementById("login-button");

  if (validatePassword(password) && captchaChecked) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

document.getElementById("login-password").addEventListener("input", () => {
  const password = document.getElementById("login-password").value;
  if (!validatePassword(password)) {
    alert(
      "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character."
    );
  }
  enableLoginButton();
});

function loginUser(event) {
  event.preventDefault();

  // Ensure CAPTCHA is verified
  if (!document.getElementById("captcha-checkbox").checked) {
    alert("Please verify the CAPTCHA.");
    return;
  }

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Validate the password format
  if (!validatePassword(password)) {
    alert("Please input the correct format of password.");
    return; // Stop login if the password is invalid
  }

  // Hardcoded credentials
  const hardcodedEmail = "admin@email.com";
  const hardcodedPasswordHash = "047658c84a2952ac862f1001773d02363834267f"; // Hash of AdminPass123@

  // Hash the entered password
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
