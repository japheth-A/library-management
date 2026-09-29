// ==========================================
// ADMIN LOGIN CHECK
// ==========================================

if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const adminEmailElement = document.getElementById("adminEmail");
const messageElement = document.getElementById("message");

const booksTable = document.getElementById("booksTable");
const membersTable = document.getElementById("membersTable");
const usersTable = document.getElementById("usersTable");
const borrowingsTable = document.getElementById("borrowingsTable");


// ==========================================
// ADMIN EMAIL
// ==========================================

const savedAdminEmail =
    localStorage.getItem("adminEmail") || "Administrator";

if (adminEmailElement) {
    adminEmailElement.textContent = savedAdminEmail;
}

const welcomeEmail =
    document.getElementById("welcomeEmail");

if (welcomeEmail) {
    welcomeEmail.textContent = savedAdminEmail;
}


// ==========================================
// SHOW SECTION
// ==========================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".dashboard-section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.classList.add("active");

        selectedSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text, type = "success") {

    if (!messageElement) {
        return;
    }

    messageElement.textContent = text;

    messageElement.className =
        "message " + type;

    setTimeout(() => {

        messageElement.className =
            "message";

    }, 3000);
}


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        await loadBooks();

        await loadMembers();

        await loadUsers();

        await loadBorrowings();

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showMessage(
            "Could not load dashboard data.",
            "error"
        );
    }
}


// ==========================================
// LOAD BOOKS
// ==========================================

async function loadBooks() {

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
                <td colspan="8" class="empty">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    books.forEach(book => {

        const row =
            document.createElement("tr");

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
                ${escapeHtml(book.isbn || "-")}
            </td>

            <td>
                ${escapeHtml(book.category || "-")}
            </td>

            <td>
                ${book.quantity}
            </td>

            <td>
                ${book.availableQuantity}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editBook(${book.id})">

                    Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteBook(${book.id})">

                    Delete

                </button>

            </td>
        `;

        booksTable.appendChild(row);

    });
}


// ==========================================
// LOAD MEMBERS
// ==========================================

async function loadMembers() {

    const response =
        await fetch("/api/members");

    if (!response.ok) {

        throw new Error(
            "Could not load members"
        );
    }

    const members =
        await response.json();

    membersTable.innerHTML = "";

    if (members.length === 0) {

        membersTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No members found.
                </td>
            </tr>
        `;

        return;
    }


    members.forEach(member => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${member.id}
            </td>

            <td>
                ${escapeHtml(member.name)}
            </td>

            <td>
                ${escapeHtml(member.email)}
            </td>

            <td>
                ${escapeHtml(member.phone || "-")}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editMember(${member.id})">

                    Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteMember(${member.id})">

                    Delete

                </button>

            </td>

        `;

        membersTable.appendChild(row);

    });
}


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    const response =
        await fetch("/api/users");

    if (!response.ok) {

        throw new Error(
            "Could not load users"
        );
    }

    const users =
        await response.json();

    usersTable.innerHTML = "";

    if (users.length === 0) {

        usersTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No registered users.
                </td>
            </tr>
        `;

        return;
    }


    users.forEach(user => {

        const row =
            document.createElement("tr");


        let adminButton = "";

        if (user.role !== "ADMIN") {

            adminButton = `
                <button
                    class="action-btn"
                    onclick="promoteUser(${user.id})">

                    Make Admin

                </button>
            `;

        } else {

            adminButton = `
                <span>
                    Admin
                </span>
            `;
        }


        row.innerHTML = `

            <td>
                ${user.id}
            </td>

            <td>
                ${escapeHtml(user.name)}
            </td>

            <td>
                ${escapeHtml(user.email)}
            </td>

            <td>
                ${user.role}
            </td>

            <td>

                ${adminButton}

                <button
                    class="action-btn delete-btn"
                    onclick="deleteUser(${user.id})">

                    Delete

                </button>

            </td>

        `;

        usersTable.appendChild(row);

    });
}


// ==========================================
// LOAD BORROWINGS
// ==========================================

async function loadBorrowings() {

    const response =
        await fetch("/api/borrowings");

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
                <td colspan="8" class="empty">
                    No borrowing records found.
                </td>
            </tr>
        `;

        return;
    }


    borrowings.forEach(borrowing => {

        const book =
            borrowing.book
                ? borrowing.book.title
                : "-";

        const user =
            borrowing.user
                ? borrowing.user.name
                : "-";

        const member =
            borrowing.member
                ? borrowing.member.name
                : "-";

        const status =
            borrowing.status || "-";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${borrowing.id}
            </td>

            <td>
                ${escapeHtml(book)}
            </td>

            <td>
                ${escapeHtml(user)}
            </td>

            <td>
                ${escapeHtml(member)}
            </td>

            <td>
                ${borrowing.borrowDate || "-"}
            </td>

            <td>
                ${borrowing.dueDate || "-"}
            </td>

            <td>

                <span
                    class="status ${status}">

                    ${status}

                </span>

            </td>

            <td>

                ${
            status !== "RETURNED"
                ?
                `
                    <button
                        class="action-btn return-btn"
                        onclick="returnBook(${borrowing.id})">

                        Return

                    </button>
                    `
                :
                ""
        }


                <button
                    class="action-btn delete-btn"
                    onclick="deleteBorrowing(${borrowing.id})">

                    Delete

                </button>

            </td>

        `;

        borrowingsTable.appendChild(row);

    });
}


// ==========================================
// OPEN BOOK MODAL
// ==========================================

function openBookModal() {

    document.getElementById(
        "bookModalTitle"
    ).textContent = "Add Book";


    document.getElementById(
        "bookForm"
    ).reset();


    document.getElementById(
        "bookId"
    ).value = "";


    document.getElementById(
        "bookModal"
    ).classList.add("show");
}


// ==========================================
// CLOSE BOOK MODAL
// ==========================================

function closeBookModal() {

    document.getElementById(
        "bookModal"
    ).classList.remove("show");
}


// ==========================================
// SAVE BOOK
// ==========================================

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "bookId"
                ).value;


            const quantity =
                Number(
                    document.getElementById(
                        "bookQuantity"
                    ).value
                );


            const availableQuantity =
                Number(
                    document.getElementById(
                        "bookAvailable"
                    ).value
                );


            if (
                availableQuantity >
                quantity
            ) {

                showMessage(
                    "Available quantity cannot be greater than total quantity.",
                    "error"
                );

                return;
            }


            const book = {

                title:
                    document.getElementById(
                        "bookTitle"
                    ).value.trim(),

                author:
                    document.getElementById(
                        "bookAuthor"
                    ).value.trim(),

                isbn:
                    document.getElementById(
                        "bookIsbn"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "bookCategory"
                    ).value.trim(),

                quantity:
                quantity,

                availableQuantity:
                availableQuantity
            };


            try {

                const url =
                    id
                        ? `/api/books/${id}`
                        : "/api/books";


                const method =
                    id
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(book)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Could not save book"
                    );
                }


                closeBookModal();


                showMessage(
                    id
                        ? "Book updated successfully."
                        : "Book added successfully."
                );


                await loadBooks();

            } catch (error) {

                console.error(error);

                showMessage(
                    "Could not save book.",
                    "error"
                );
            }

        }
    );


// ==========================================
// EDIT BOOK
// ==========================================

async function editBook(id) {

    try {

        const response =
            await fetch(
                `/api/books/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Book not found"
            );
        }


        const book =
            await response.json();


        document.getElementById(
            "bookModalTitle"
        ).textContent = "Edit Book";


        document.getElementById(
            "bookId"
        ).value = book.id;


        document.getElementById(
            "bookTitle"
        ).value = book.title || "";


        document.getElementById(
            "bookAuthor"
        ).value = book.author || "";


        document.getElementById(
            "bookIsbn"
        ).value = book.isbn || "";


        document.getElementById(
            "bookCategory"
        ).value = book.category || "";


        document.getElementById(
            "bookQuantity"
        ).value = book.quantity;


        document.getElementById(
            "bookAvailable"
        ).value = book.availableQuantity;


        document.getElementById(
            "bookModal"
        ).classList.add("show");

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not load book.",
            "error"
        );
    }
}


// ==========================================
// DELETE BOOK
// ==========================================

async function deleteBook(id) {

    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/books/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete book"
            );
        }


        showMessage(
            "Book deleted successfully."
        );


        await loadBooks();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not delete book.",
            "error"
        );
    }
}


// ==========================================
// OPEN MEMBER MODAL
// ==========================================

function openMemberModal() {

    document.getElementById(
        "memberModalTitle"
    ).textContent = "Add Member";


    document.getElementById(
        "memberForm"
    ).reset();


    document.getElementById(
        "memberId"
    ).value = "";


    document.getElementById(
        "memberModal"
    ).classList.add("show");
}


// ==========================================
// CLOSE MEMBER MODAL
// ==========================================

function closeMemberModal() {

    document.getElementById(
        "memberModal"
    ).classList.remove("show");
}


// ==========================================
// SAVE MEMBER
// ==========================================

document
    .getElementById("memberForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "memberId"
                ).value;


            const member = {

                name:
                    document.getElementById(
                        "memberName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "memberEmail"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "memberPhone"
                    ).value.trim()
            };


            try {

                const response =
                    await fetch(
                        id
                            ? `/api/members/${id}`
                            : "/api/members",
                        {
                            method:
                                id
                                    ? "PUT"
                                    : "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(member)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Could not save member"
                    );
                }


                closeMemberModal();


                showMessage(
                    id
                        ? "Member updated successfully."
                        : "Member added successfully."
                );


                await loadMembers();

            } catch (error) {

                console.error(error);

                showMessage(
                    "Could not save member.",
                    "error"
                );
            }

        }
    );


// ==========================================
// EDIT MEMBER
// ==========================================

async function editMember(id) {

    try {

        const response =
            await fetch(
                `/api/members/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Member not found"
            );
        }


        const member =
            await response.json();


        document.getElementById(
            "memberModalTitle"
        ).textContent = "Edit Member";


        document.getElementById(
            "memberId"
        ).value = member.id;


        document.getElementById(
            "memberName"
        ).value = member.name || "";


        document.getElementById(
            "memberEmail"
        ).value = member.email || "";


        document.getElementById(
            "memberPhone"
        ).value = member.phone || "";


        document.getElementById(
            "memberModal"
        ).classList.add("show");

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not load member.",
            "error"
        );
    }
}


// ==========================================
// DELETE MEMBER
// ==========================================

async function deleteMember(id) {

    if (
        !confirm(
            "Are you sure you want to delete this member?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/members/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete member"
            );
        }


        showMessage(
            "Member deleted successfully."
        );


        await loadMembers();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not delete member.",
            "error"
        );
    }
}


// ==========================================
// PROMOTE USER
// ==========================================

async function promoteUser(id) {

    if (
        !confirm(
            "Make this user an administrator?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/users/${id}/promote`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not promote user"
            );
        }


        showMessage(
            "User promoted to ADMIN."
        );


        await loadUsers();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not promote user.",
            "error"
        );
    }
}


// ==========================================
// DELETE USER
// ==========================================

async function deleteUser(id) {

    if (
        !confirm(
            "Are you sure you want to delete this user?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/users/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete user"
            );
        }


        showMessage(
            "User deleted successfully."
        );


        await loadUsers();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not delete user.",
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
            "Mark this book as returned?"
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
// DELETE BORROWING
// ==========================================

async function deleteBorrowing(id) {

    if (
        !confirm(
            "Delete this borrowing record?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/borrowings/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete borrowing"
            );
        }


        showMessage(
            "Borrowing record deleted."
        );


        await loadBorrowings();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not delete borrowing record.",
            "error"
        );
    }
}


// ==========================================
// UPDATE OVERDUE
// ==========================================

async function updateOverdue() {

    try {

        const response =
            await fetch(
                "/api/borrowings/update-overdue",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not update overdue records"
            );
        }


        showMessage(
            "Overdue records updated."
        );


        await loadBorrowings();

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not update overdue records.",
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

            localStorage.removeItem(
                "adminLoggedIn"
            );

            localStorage.removeItem(
                "adminEmail"
            );

            window.location.href =
                "admin-login.html";
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
// START DASHBOARD
// ==========================================

loadDashboard();