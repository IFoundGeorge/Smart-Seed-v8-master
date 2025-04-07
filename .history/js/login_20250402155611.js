document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".message a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll("form").forEach((form) => {
        form.classList.toggle("hidden");
      });
    });
  });

  // Disable login button initially
  document.getElementById("login-button").disabled = true;

  // Add password validation listener
  document
    .getElementById("login-password")
    .addEventListener("input", function () {
      validatePassword(this.value);
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
  const loginButton = document.getElementById("login-button");

  if (!passwordRegex.test(password)) {
    loginButton.disabled = true;
    return false;
  }
  enableLoginButton();
  return true;
}

function enableLoginButton() {
  const password = document.getElementById("login-password").value;
  const captchaChecked = document.getElementById("captcha-checkbox").checked;

  if (validatePassword(password) && captchaChecked) {
    document.getElementById("login-button").disabled = false;
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

  if (!validatePassword(password)) {
    alert(
      "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character."
    );
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
