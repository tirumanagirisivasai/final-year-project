const database = JSON.parse(localStorage.getItem("users")) || [];

// Show the home page
function showHomePage() {
    document.getElementById('about-section').classList.remove('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('problem-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.add('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-password-section').classList.add('hidden');
}

// Show login page
function showLoginPage() {
    document.getElementById('signup-form-section').classList.add('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('problem-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.add('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-password-section').classList.add('hidden');
}

// Show feedback form
function showFeedbackForm() {
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('problem-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.remove('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-password-section').classList.add('hidden');
}

// Show contact section
function showContactSection() {
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('problem-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.add('hidden');
    document.getElementById('contact-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-password-section').classList.add('hidden');
}

function openAdminView() {
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('problem-section').classList.add('hidden');
    document.getElementById('feedback-section').classList.add('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-password-section').classList.remove('hidden');
}

// Event listener for "Existing User" button
document.getElementById('existing-user-button').addEventListener('click', function() {
    showLoginForm(); // Show the login form
});

// Event listener for "New User" button
document.getElementById('new-user-button').addEventListener('click', function() {
    showSignupForm(); // Show the signup form
});

// Function to show the signup form and hide the login form
function showSignupForm() {
    document.getElementById('signup-form-section').classList.remove('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
}

// Function to show the login form and hide the signup form
function showLoginForm() {
    document.getElementById('login-form-section').classList.remove('hidden');
    document.getElementById('signup-form-section').classList.add('hidden');
}

// Register a new user
function registerUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('signup-first-name').value.trim();
    const lastName = document.getElementById('signup-last-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const mobile = document.getElementById('signup-mobile').value.trim();

    if (!firstName || !lastName || !email || !password || !mobile) {
        alert("Please fill in all fields!");
        return;
    }

    // Check if email already exists
    const userExists = database.some(user => user.email === email);
    if (userExists) {
        alert("Email already registered. Please log in.");
        showLoginForm(); // After failure, go to login form
        return;
    }

    // Store user details in database
    database.push({ firstName, lastName, email, password, mobile });
    localStorage.setItem("users", JSON.stringify(database));

    alert("Account created successfully! Please log in.");
    showLoginForm();  // Redirect to login after successful signup
}

// Login function
function loginUser(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Find the user in the database
    const user = database.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.firstName}!`);

        // Hide login and show the problem section
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('problem-section').classList.remove('hidden');
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

// Function to show the problem page
function showProblemPage() {
    document.getElementById('problem-section').classList.remove('hidden');
    document.getElementById('login-form-section').classList.add('hidden');
}

// Submit problem form
function submitProblem(event) {
    event.preventDefault();
    var userInput = document.getElementById("user_input").value;

    fetch("/get_relevant_sections", {
        method: "POST",
        body: new FormData(document.getElementById("problem-form")),
    })
    .then(response => response.json())
    .then(data => {
        var resultSection = document.getElementById("result-section");
        var resultText = document.getElementById("results");

        if (data.message) {
            resultText.textContent = data.message;
        } else {
            let resultsHTML = '';
            data.forEach(result => {
                resultsHTML += `
                    <div class="card">
                        <h3>Section Number: ${result.SectionNumber}</h3>
                        <h4>Title: ${result.SectionTitle}</h4>
                        <p><strong>Description:</strong> ${result.SectionDescription}</p>
                        <p><strong>Illustrations:</strong> ${result.Illustrations}</p>
                        <p><strong>Punishment:</strong> ${result.Punishment}</p>
                        <p><strong>Fine:</strong> ${result.Fine}</p>
                        <p><strong>Bailable or Not:</strong> ${result.BailableOrNot}</p>
                    </div>
                `;
            });
            resultText.innerHTML = resultsHTML;
        }

        resultSection.classList.remove("hidden");
    })
    .catch(error => console.error("Error:", error));
}

// Submit feedback
function submitFeedback(event) {
    event.preventDefault();

    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const email = document.getElementById('feedback-email').value;
    const message = document.getElementById('feedback-message').value;

    if (!rating || !email || !message) {
        alert("Please complete all fields before submitting feedback.");
        return;
    }

    console.log('Rating:', rating);
    console.log('Email:', email);
    console.log('Feedback Message:', message);

    document.querySelector('.form-section').classList.add('hidden');
    document.getElementById('thank-you-message').classList.remove('hidden');
}

function validateAdminPassword() {
    const enteredPassword = document.getElementById('admin-password-input').value.trim();
    const adminPassword = "project24"; // Hardcoded admin password

    if (enteredPassword === adminPassword) {
        showAdminResults();  // If password is correct, show user list
    } else {
        alert("Incorrect password! Access denied.");
    }
}

function showAdminResults() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userList = document.getElementById("admin-user-list");

    // Check if the user list container is found
    if (!userList) {
        console.error("Element with ID 'admin-user-list' not found.");
        return;
    }

    if (users.length === 0) {
        userList.innerHTML = "<p>No users have signed up yet.</p>";
    } else {
        let userHTML = "<h3>Signed-Up Users</h3><ul>";
        users.forEach(user => {
            userHTML += `<li>${user.firstName} ${user.lastName} - ${user.email} - ${user.mobile}</li>`;
        });
        userHTML += "</ul>";
        userList.innerHTML = userHTML;
    }

    // Make sure the list is visible
    document.getElementById('admin-results-section').classList.remove('hidden');

    // Hide the password section after showing the results
    document.getElementById('admin-password-section').classList.add('hidden');
}