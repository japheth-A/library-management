const API = "/api/books";

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

let editingBookId = null;

async function loadBooks() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to load books");
        }

        const books = await response.json();

        displayBooks(books);

    } catch (error) {

        console.error(error);

        alert("Could not load books.");

    }
}

function displayBooks(books) {

    const table =
        document.getElementById("booksTable");

    table.innerHTML = "";

    books.forEach(book => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${book.id}</td>

            <td>${escapeHtml(book.title)}</td>

            <td>${escapeHtml(book.author)}</td>

            <td>${escapeHtml(book.isbn || "")}</td>

            <td>${escapeHtml(book.category || "")}</td>

            <td>${book.quantity}</td>

            <td>${book.availableQuantity}</td>

            <td>

                <button
                    class="btn small"
                    onclick="editBook(${book.id})">

                    Edit

                </button>

                <button
                    class="btn small danger"
                    onclick="deleteBook(${book.id})">

                    Delete

                </button>

            </td>
        `;

        table.appendChild(row);

    });
}

async function searchBooks() {

    const search =
        document.getElementById("searchInput")
            .value.trim();

    if (!search) {

        loadBooks();

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/search/title?title=${
                    encodeURIComponent(search)
                }`
            );

        const books = await response.json();

        displayBooks(books);

    } catch (error) {

        console.error(error);

    }
}

function openBookModal() {

    editingBookId = null;

    document.getElementById("modalTitle")
        .textContent = "Add Book";

    document.getElementById("bookForm")
        .reset();

    document.getElementById("bookId")
        .value = "";

    document.getElementById("bookModal")
        .classList.add("show");
}

function closeBookModal() {

    document.getElementById("bookModal")
        .classList.remove("show");
}

async function editBook(id) {

    try {

        const response =
            await fetch(`${API}/${id}`);

        const book = await response.json();

        editingBookId = id;

        document.getElementById("modalTitle")
            .textContent = "Edit Book";

        document.getElementById("bookId")
            .value = book.id;

        document.getElementById("title")
            .value = book.title;

        document.getElementById("author")
            .value = book.author;

        document.getElementById("isbn")
            .value = book.isbn || "";

        document.getElementById("category")
            .value = book.category || "";

        document.getElementById("quantity")
            .value = book.quantity;

        document.getElementById("bookModal")
            .classList.add("show");

    } catch (error) {

        alert("Could not load book.");

    }
}

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const book = {

                title:
                document.getElementById("title")
                    .value,

                author:
                document.getElementById("author")
                    .value,

                isbn:
                document.getElementById("isbn")
                    .value,

                category:
                document.getElementById("category")
                    .value,

                quantity:
                    Number(
                        document.getElementById("quantity")
                            .value
                    )
            };

            try {

                const url =
                    editingBookId
                        ? `${API}/${editingBookId}`
                        : API;

                const method =
                    editingBookId
                        ? "PUT"
                        : "POST";

                const response =
                    await fetch(url, {

                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(book)
                    });

                if (!response.ok) {

                    const error =
                        await response.text();

                    throw new Error(error);
                }

                closeBookModal();

                await loadBooks();

            } catch (error) {

                console.error(error);

                alert("Could not save book.");

            }

        }
    );

async function deleteBook(id) {

    if (!confirm("Delete this book?")) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        loadBooks();

    } catch (error) {

        alert(
            "Book cannot be deleted if it has borrowing records."
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

loadBooks();