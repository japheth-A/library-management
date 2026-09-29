const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        const response = await fetch("/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });


        if (!response.ok) {

            throw new Error("Invalid login");

        }


        const user = await response.json();


        // Save user information
        localStorage.setItem(
            "userId",
            user.id
        );

        localStorage.setItem(
            "userName",
            user.name
        );

        localStorage.setItem(
            "userEmail",
            user.email
        );


        message.textContent =
            "Login successful!";

        message.className =
            "success";


        setTimeout(function () {

            window.location.href =
                "user-dashboard.html";

        }, 700);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Invalid email or password.";

        message.className =
            "error";

    }

});