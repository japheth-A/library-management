if (
    localStorage.getItem(
        "userLoggedIn"
    ) !== "true"
) {
    window.location.href =
        "user-login.html";
}

const userId =
    localStorage.getItem("userId");

async function loadBorrowings() {

    try {

        const response =
            await fetch(
                `/api/borrowings/user/${userId}`
            );

        const borrowings =
            await response.json();

        const table =
            document.getElementById(
                "borrowingsTable"
            );

        table.innerHTML = "";

        borrowings.forEach(borrowing => {

            const row =
                document.createElement("tr");

            const book =
                borrowing.book;

            row.innerHTML = `

                <td>
                    ${escapeHtml(
                book?.title || "Unknown"
            )}
                </td>

                <td>
                    ${escapeHtml(
                book?.author || "Unknown"
            )}
                </td>

                <td>
                    ${borrowing.borrowDate}
                </td>

                <td>
                    ${borrowing.dueDate}
                </td>

                <td>
                    ${
                borrowing.returnDate ||
                "-"
            }
                </td>

                <td>

                    <span class="status
                        ${getStatusClass(
                borrowing.status
            )}">

                        ${borrowing.status}

                    </span>

                </td>

                <td>

                    ${
                borrowing.status !==
                "RETURNED"

                    ?

                    `<button
                            class="return-button"
                            onclick="returnBook(
                                ${borrowing.id}
                            )">

                            Return

                        </button>`

                    :

                    "Completed"
            }

                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }
}

function getStatusClass(status) {

    if (status === "RETURNED") {
        return "returned";
    }

    if (status === "OVERDUE") {
        return "overdue";
    }

    return "borrowed";
}

async function returnBook(id) {

    if (
        !confirm(
            "Do you want to return this book?"
        )
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/borrowings/${id}/return`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Could not return book"
            );
        }

        alert(
            "Book returned successfully."
        );

        loadBorrowings();

    } catch (error) {

        alert(error.message);

    }
}

function logout() {

    localStorage.clear();

    window.location.href =
        "user-login.html";
}

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}

loadBorrowings();