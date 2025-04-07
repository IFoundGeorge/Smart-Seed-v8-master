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

function loginUser(event) {
  event.preventDefault();

  console.log("Login attempted");

  if (!document.getElementById("captcha-checkbox").checked) {
    console.log("CAPTCHA not verified");
    showNotification("Please verify the CAPTCHA first.");
    return;
  }

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Example of authentication logic (replace this with actual logic)
  if (email === "test@example.com" && password === "password123") {
    console.log("Login successful");
    showNotification("Login successful!", "green");
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Redirect after successful login
    }, 1000);
  } else {
    console.log("Incorrect email or password");
    showNotification("Incorrect email or password.");
  }
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
