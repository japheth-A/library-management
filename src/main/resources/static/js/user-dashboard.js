// ==========================================
// CHECK LOGIN
// ==========================================

const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "user-login.html";
}


// ==========================================
// USER INFORMATION
// ==========================================

const userName =
    localStorage.getItem("userName") || "User";

const userEmail =
    localStorage.getItem("userEmail") || "";


// ==========================================
// DISPLAY USER
// ==========================================

document.getElementById("userName").textContent =
    userName;

document.getElementById("profileName").textContent =
    userName;

document.getElementById("profileEmail").textContent =
    userEmail;

document.getElementById("profileId").textContent =
    userId;


// ==========================================
// ELEMENTS
// ==========================================

const booksTable =
    document.getElementById("booksTable");

const borrowingsTable =
    document.getElementById("borrowingsTable");

const message =
    document.getElementById("message");


// ==========================================
// SHOW SECTION
// ==========================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".user-section");

    sections.forEach(section => {

        section.classList.remove("active");

    });


    const section =
        document.getElementById(sectionId);

    if (section) {

        section.classList.add("active");

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text, type = "success") {

    message.textContent = text;

    message.className =
        "message " + type;

    setTimeout(() => {

        message.className =
            "message";

        message.textContent = "";

    }, 3000);

}


// ==========================================
// LOAD BOOKS
// ==========================================

async function loadBooks() {

    try {

        const response =
            await fetch("/api/books");


        if (!response.ok) {

            throw new Error(
                "Could not load books"
            );

        }


        const books =
            await response.json();


        booksTable.innerHTML = "";


        if (books.length === 0) {

            booksTable.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="empty">

                        No books available.

                    </td>
                </tr>
            `;

            return;
        }


        books.forEach(book => {

            const row =
                document.createElement("tr");


            const available =
                book.availableQuantity > 0;


            row.innerHTML = `

                <td>
                    ${book.id}
                </td>

                <td>
                    ${escapeHtml(book.title)}
                </td>

                <td>
                    ${escapeHtml(book.author)}
                </td>

                <td>
                    ${escapeHtml(
                book.category || "-"
            )}
                </td>

                <td>

                    <span class="
                        ${available
                ? "available"
                : "unavailable"}
                    ">

                        ${book.availableQuantity}

                    </span>

                </td>

                <td>

                    ${
                available

                    ?

                    `
                        <button
                            class="borrow-btn"
                            onclick="borrowBook(${book.id})">

                            Borrow

                        </button>
                        `

                    :

                    `
                        <span class="unavailable">
                            Unavailable
                        </span>
                        `
            }

                </td>

            `;


            booksTable.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not load books.",
            "error"
        );

    }

}


// ==========================================
// BORROW BOOK
// ==========================================

async function borrowBook(bookId) {

    // Create date input
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.style.position = "fixed";
    dateInput.style.opacity = "0";
    dateInput.style.pointerEvents = "none";

    document.body.appendChild(dateInput);

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split("T")[0];
    dateInput.min = minDate;

    // Open calendar
    dateInput.showPicker();

    // Wait for user to select a date
    dateInput.addEventListener("change", async function () {

        const dueDate = dateInput.value;

        document.body.removeChild(dateInput);

        if (!dueDate) {
            return;
        }

        try {

            const userId = localStorage.getItem("userId");

            const response = await fetch(
                `/api/borrowings/user/borrow?bookId=${bookId}&userId=${userId}&dueDate=${dueDate}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Unable to borrow book");
            }

            showMessage("Book borrowed successfully!");

            loadBooks();
            loadBorrowings();

        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to borrow book.",
                "error"
            );
        }
    });
}



// ==========================================
// LOAD BORROWINGS
// ==========================================

async function loadBorrowings() {

    try {

        const response =
            await fetch(
                `/api/borrowings/user/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load borrowings"
            );

        }


        const borrowings =
            await response.json();


        borrowingsTable.innerHTML = "";


        if (borrowings.length === 0) {

            borrowingsTable.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="empty">

                        You have no borrowing records.

                    </td>
                </tr>
            `;

            return;
        }


        borrowings.forEach(borrowing => {

            const row =
                document.createElement("tr");


            const bookTitle =
                borrowing.book
                    ? borrowing.book.title
                    : "-";


            const status =
                borrowing.status || "-";


            row.innerHTML = `

                <td>
                    ${borrowing.id}
                </td>

                <td>
                    ${escapeHtml(bookTitle)}
                </td>

                <td>
                    ${borrowing.borrowDate || "-"}
                </td>

                <td>
                    ${borrowing.dueDate || "-"}
                </td>

                <td>

                    <span class="
                        status
                        ${status}
                    ">

                        ${status}

                    </span>

                </td>

                <td>

                    ${
                status !== "RETURNED"

                    ?

                    `
                        <button
                            class="return-btn"
                            onclick="returnBook(
                                ${borrowing.id}
                            )">

                            Return

                        </button>
                        `

                    :

                    `
                        <span>
                            Returned
                        </span>
                        `
            }

                </td>

            `;


            borrowingsTable.appendChild(row);

        });


    } catch (error) {

        console.error(error);

        showMessage(
            "Could not load your borrowing records.",
            "error"
        );

    }

}


// ==========================================
// RETURN BOOK
// ==========================================

async function returnBook(id) {

    if (
        !confirm(
            "Are you sure you want to return this book?"
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


        showMessage(
            "Book returned successfully."
        );


        await loadBooks();

        await loadBorrowings();


    } catch (error) {

        console.error(error);

        showMessage(
            "Could not return book.",
            "error"
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            localStorage.removeItem("userId");

            localStorage.removeItem("userName");

            localStorage.removeItem("userEmail");

            window.location.href =
                "user-login.html";

        }
    );


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ==========================================
// START
// ==========================================

loadBooks();

loadBorrowings();