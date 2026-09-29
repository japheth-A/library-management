const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const password =
            document.getElementById("password")
                .value;


        if (password.length < 4) {

            message.textContent =
                "Password must contain at least 4 characters.";

            message.className =
                "error";

            return;
        }


        try {

            const response =
                await fetch(
                    "/api/users/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password,

                            role: "USER"

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Registration failed"
                );

            }


            message.textContent =
                "Account created successfully!";

            message.className =
                "success";


            registerForm.reset();


            setTimeout(function () {

                window.location.href =
                    "user-login.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Registration failed. Email may already exist.";

            message.className =
                "error";

        }

    }
);