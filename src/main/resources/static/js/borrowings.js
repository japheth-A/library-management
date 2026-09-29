const API = "/api";

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

async function loadBorrowings() {

    try {

        const response =
            await fetch(`${API}/borrowings`);

        if (!response.ok) {
            throw new Error("Failed");
        }

        const borrowings =
            await response.json();

        displayBorrowings(borrowings);

    } catch (error) {

        console.error(error);

        alert("Could not load borrowings.");

    }
}

function displayBorrowings(borrowings) {

    const table =
        document.getElementById(
            "borrowingsTable"
        );

    table.innerHTML = "";

    borrowings.forEach(borrowing => {

        const row =
            document.createElement("tr");

        let action = "";

        if (borrowing.status !== "RETURNED") {

            action = `

                <button
                    class="btn small"
                    onclick="returnBook(
                        ${borrowing.id}
                    )">

                    Return

                </button>

            `;

        } else {

            action = "Completed";

        }

        row.innerHTML = `

            <td>${borrowing.id}</td>

            <td>
                ${escapeHtml(
            borrowing.book?.title ||
            "Unknown"
        )}
            </td>

            <td>
                ${escapeHtml(
            borrowing.member?.name ||
            "Unknown"
        )}
            </td>

            <td>
                ${borrowing.borrowDate || ""}
            </td>

            <td>
                ${borrowing.dueDate || ""}
            </td>

            <td>
                ${borrowing.returnDate || "-"}
            </td>

            <td>

                <span
                    class="status
                    ${getStatusClass(
            borrowing.status
        )}">

                    ${borrowing.status}

                </span>

            </td>

            <td>${action}</td>

        `;

        table.appendChild(row);

    });
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

async function loadBooksForBorrowing() {

    const select =
        document.getElementById(
            "borrowBook"
        );

    select.innerHTML =
        '<option value="">Select book</option>';

    try {

        const response =
            await fetch(`${API}/books`);

        const books =
            await response.json();

        books
            .filter(
                book =>
                    book.availableQuantity > 0
            )
            .forEach(book => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = book.id;

                option.textContent =
                    `${book.title} ` +
                    `(${book.availableQuantity} available)`;

                select.appendChild(option);

            });

    } catch (error) {

        console.error(error);

    }
}

async function loadMembersForBorrowing() {

    const select =
        document.getElementById(
            "borrowMember"
        );

    select.innerHTML =
        '<option value="">Select member</option>';

    try {

        const response =
            await fetch(`${API}/members`);

        const members =
            await response.json();

        members.forEach(member => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = member.id;

            option.textContent =
                member.name;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(error);

    }
}

function openBorrowModal() {

    document.getElementById(
        "borrowModal"
    ).classList.add("show");

    loadBooksForBorrowing();

    loadMembersForBorrowing();

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    document.getElementById(
        "dueDate"
    ).setAttribute(
        "min",
        today
    );

    document.getElementById(
        "borrowForm"
    ).reset();
}

function closeBorrowModal() {

    document.getElementById(
        "borrowModal"
    ).classList.remove("show");
}

document
    .getElementById("borrowForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const bookId =
                document.getElementById(
                    "borrowBook"
                ).value;

            const memberId =
                document.getElementById(
                    "borrowMember"
                ).value;

            const dueDate =
                document.getElementById(
                    "dueDate"
                ).value;

            if (
                !bookId ||
                !memberId ||
                !dueDate
            ) {

                alert(
                    "Please fill all fields."
                );

                return;
            }

            try {

                const url =
                    `${API}/borrowings/borrow` +
                    `?bookId=${bookId}` +
                    `&memberId=${memberId}` +
                    `&dueDate=${dueDate}`;

                const response =
                    await fetch(
                        url,
                        {
                            method: "POST"
                        }
                    );

                if (!response.ok) {

                    const error =
                        await response.text();

                    throw new Error(error);
                }

                alert(
                    "Book borrowed successfully."
                );

                closeBorrowModal();

                loadBorrowings();

            } catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Could not borrow book."
                );

            }

        }
    );

async function returnBook(id) {

    if (!confirm("Return this book?")) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/borrowings/${id}/return`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }

        alert(
            "Book returned successfully."
        );

        loadBorrowings();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Could not return book."
        );

    }
}

function logout() {

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("username");

    window.location.href = "index.html";
}

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}

loadBorrowings();