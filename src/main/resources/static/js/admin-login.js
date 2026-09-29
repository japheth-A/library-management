const form = document.getElementById("adminLoginForm");

const message = document.getElementById("message");


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const passcode = document.getElementById("passcode").value.trim();


    try {

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                passcode: passcode
            })

        });


        const data = await response.json();


        if (data.success) {

            localStorage.setItem("adminLoggedIn", "true");

            localStorage.setItem("adminEmail", email);


            message.textContent = data.message;

            message.className = "success";


            setTimeout(() => {

                window.location.href = "admin.dashboard.html";

            }, 700);

        } else {

            message.textContent = data.message;

            message.className = "error";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";

        message.className = "error";

    }

});