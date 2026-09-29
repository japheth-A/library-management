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

let selectedBookId = null;

let allBooks = [];

async function loadBooks() {

    try {

        const response =
            await fetch("/api/books");

        allBooks =
            await response.json();

        displayBooks(allBooks);

    } catch (error) {

        console.error(error);

    }
}

function displayBooks(books) {

    const container =
        document.getElementById(
            "booksContainer"
        );

    container.innerHTML = "";

    books.forEach(book => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";

        card.innerHTML = `

            <div class="book-icon">
                📖
            </div>

            <h3>
                ${escapeHtml(book.title)}
            </h3>

            <p>
                By ${escapeHtml(book.author)}
            </p>

            <small>
                ${escapeHtml(
            book.category || "General"
        )}
            </small>

            <div class="book-availability">

                ${
            book.availableQuantity > 0
                ?
                `${book.availableQuantity}
                     available`
                :
                "Not available"
        }

            </div>

            <button
                class="user-button"
                ${
            book.availableQuantity <= 0
                ? "disabled"
                : ""
        }
                onclick="openBorrowModal(
                    ${book.id},
                    '${escapeAttribute(
            book.title
        )}'
                )">

                ${
            book.availableQuantity > 0
                ? "Borrow Book"
                : "Unavailable"
        }

            </button>
        `;

        container.appendChild(card);

    });
}

function searchBooks() {

    const search =
        document.getElementById(
            "search"
        ).value
            .toLowerCase()
            .trim();

    const filtered =
        allBooks.filter(book =>
            book.title
                .toLowerCase()
                .includes(search)
            ||
            book.author
                .toLowerCase()
                .includes(search)
        );

    displayBooks(filtered);
}

function openBorrowModal(
    bookId,
    title
) {

    selectedBookId = bookId;

    document.getElementById(
        "selectedBook"
    ).textContent =
        `Book: ${title}`;

    const tomorrow =
        new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    document.getElementById(
        "dueDate"
    ).min =
        tomorrow
            .toISOString()
            .split("T")[0];

    document.getElementById(
        "borrowModal"
    ).classList.add("show");
}

function closeModal() {

    document.getElementById(
        "borrowModal"
    ).classList.remove("show");

    selectedBookId = null;
}

async function borrowBook() {

    const dueDate =
        document.getElementById(
            "dueDate"
        ).value;

    if (!selectedBookId || !dueDate) {

        alert(
            "Please select a due date."
        );

        return;
    }

    try {

        const url =
            `/api/borrowings/user/borrow` +
            `?bookId=${selectedBookId}` +
            `&userId=${userId}` +
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
            "Book borrowed successfully!"
        );

        closeModal();

        loadBooks();

    } catch (error) {

        alert(
            error.message ||
            "Could not borrow book."
        );

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

function escapeAttribute(value) {

    return value
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

loadBooks();