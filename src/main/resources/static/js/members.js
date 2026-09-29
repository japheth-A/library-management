const API = "/api/members";

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

let editingMemberId = null;

async function loadMembers() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to load members");
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {

        console.error(error);

        alert("Could not load members.");

    }
}

function displayMembers(members) {

    const table =
        document.getElementById("membersTable");

    table.innerHTML = "";

    members.forEach(member => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${member.id}</td>

            <td>${escapeHtml(member.name)}</td>

            <td>${escapeHtml(member.email || "")}</td>

            <td>${escapeHtml(member.phone || "")}</td>

            <td>${escapeHtml(member.address || "")}</td>

            <td>${member.registrationDate || ""}</td>

            <td>

                <button
                    class="btn small"
                    onclick="editMember(${member.id})">

                    Edit

                </button>

                <button
                    class="btn small danger"
                    onclick="deleteMember(${member.id})">

                    Delete

                </button>

            </td>
        `;

        table.appendChild(row);

    });
}

function openMemberModal() {

    editingMemberId = null;

    document.getElementById("memberModalTitle")
        .textContent = "Add Member";

    document.getElementById("memberForm")
        .reset();

    document.getElementById("memberId")
        .value = "";

    document.getElementById("memberModal")
        .classList.add("show");
}

function closeMemberModal() {

    document.getElementById("memberModal")
        .classList.remove("show");
}

async function editMember(id) {

    try {

        const response =
            await fetch(`${API}/${id}`);

        const member =
            await response.json();

        editingMemberId = id;

        document.getElementById(
            "memberModalTitle"
        ).textContent = "Edit Member";

        document.getElementById("memberId")
            .value = member.id;

        document.getElementById("memberName")
            .value = member.name;

        document.getElementById("memberEmail")
            .value = member.email || "";

        document.getElementById("memberPhone")
            .value = member.phone || "";

        document.getElementById("memberAddress")
            .value = member.address || "";

        document.getElementById("memberModal")
            .classList.add("show");

    } catch (error) {

        alert("Could not load member.");

    }
}

document
    .getElementById("memberForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const member = {

                name:
                document.getElementById(
                    "memberName"
                ).value,

                email:
                document.getElementById(
                    "memberEmail"
                ).value,

                phone:
                document.getElementById(
                    "memberPhone"
                ).value,

                address:
                document.getElementById(
                    "memberAddress"
                ).value
            };

            try {

                const url =
                    editingMemberId
                        ? `${API}/${editingMemberId}`
                        : API;

                const method =
                    editingMemberId
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
                            JSON.stringify(member)
                    });

                if (!response.ok) {
                    throw new Error("Failed");
                }

                closeMemberModal();

                loadMembers();

            } catch (error) {

                console.error(error);

                alert("Could not save member.");

            }

        }
    );

async function deleteMember(id) {

    if (!confirm("Delete this member?")) {
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

        loadMembers();

    } catch (error) {

        alert(
            "Member cannot be deleted if they have borrowing records."
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

loadMembers();