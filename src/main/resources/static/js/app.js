
const API = "/travelplan/api";

let categories = {};
let editingPlan = null;

// Display messages
function showMessage(message, type = "success") {
    const messageBox = document.getElementById("message");

    messageBox.textContent = message;
    messageBox.className = "message " + type;

    window.setTimeout(() => {
        messageBox.className = "message";
    }, 3500);
}

// Escape text before displaying API values in HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API}/categories`);

        if (!response.ok) {
            throw new Error("Unable to load categories");
        }

        categories = await response.json();

        const select = document.getElementById("planCategoryId");

        select.innerHTML = '<option value="">Select Category</option>';

        Object.entries(categories).forEach(([id, name]) => {
            const option = document.createElement("option");

            option.value = id;
            option.textContent = name;

            select.appendChild(option);
        });

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Load all travel plans
async function loadTravelPlans() {
    const table = document.getElementById("travelPlanTable");

    try {
        const response = await fetch(`${API}/all`);

        if (!response.ok) {
            throw new Error("Unable to fetch travel plans");
        }

        const plans = await response.json();

        table.innerHTML = "";

        if (!Array.isArray(plans) || plans.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="7">No travel plans found.</td>
                </tr>
            `;
        } else {
            plans.forEach(plan => {
                const status = String(plan.activateSW || "inactive").toLowerCase();
                const isActive = status === "active";

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${escapeHTML(plan.planId)}</td>

                    <td>${escapeHTML(plan.planName)}</td>

                    <td>₹${escapeHTML(plan.planminBudget)}</td>

                    <td>${escapeHTML(plan.planDescription)}</td>

                    <td>${escapeHTML(
                        categories[plan.planCategoryId] || plan.planCategoryId
                    )}</td>

                    <td>
                        <span class="status ${isActive ? "active" : "inactive"}">
                            ${escapeHTML(status)}
                        </span>
                    </td>

                    <td>
                        <button class="action-btn edit-btn"
                            onclick="editTravelPlan(${Number(plan.planId)})">
                            Edit
                        </button>

                        <button class="action-btn delete-btn"
                            onclick="deleteTravelPlan(${Number(plan.planId)})">
                            Delete
                        </button>

                        <button class="action-btn ${isActive ? "delete-btn" : "edit-btn"}"
                            onclick="changeStatus(${Number(plan.planId)}, '${isActive ? "inactive" : "active"}')">
                            ${isActive ? "Deactivate" : "Activate"}
                        </button>
                    </td>
                `;

                table.appendChild(row);
            });
        }

        updateStatistics(plans);

    } catch (error) {
        table.innerHTML = `
            <tr>
                <td colspan="7">Error loading travel plans.</td>
            </tr>
        `;

        showMessage(error.message, "error");
    }
}

// Update dashboard statistics
function updateStatistics(plans) {
    const total = plans.length;

    const active = plans.filter(plan =>
        String(plan.activateSW).toLowerCase() === "active"
    ).length;

    const inactive = total - active;

    document.getElementById("totalPlans").textContent = total;
    document.getElementById("activePlans").textContent = active;
    document.getElementById("inactivePlans").textContent = inactive;
}

// Save or update travel plan
document.getElementById("travelPlanForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const planId = document.getElementById("planId").value;

    const plan = {
        planName: document.getElementById("planName").value.trim(),

        planminBudget: Number(
            document.getElementById("planminBudget").value
        ),

        planDescription: document.getElementById("planDescription").value.trim(),

        planCategoryId: Number(
            document.getElementById("planCategoryId").value
        ),

        activateSW: document.getElementById("activateSW").value,

        createdBy: editingPlan?.createdBy || "admin",

        updatedBy: "admin"
    };

    if (!plan.planName || !plan.planDescription ||
        !plan.planCategoryId || !Number.isFinite(plan.planminBudget) ||
        plan.planminBudget < 0) {

        showMessage("Please enter valid travel plan details.", "error");
        return;
    }

    if (editingPlan) {
        plan.planId = Number(planId);
    }

    const url = editingPlan
        ? `${API}/update`
        : `${API}/register`;

    const method = editingPlan ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(plan)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to save travel plan");
        }

        showMessage(result || "Travel plan saved successfully!");

        resetForm();

        await loadTravelPlans();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Edit travel plan
async function editTravelPlan(id) {
    try {
        const response = await fetch(`${API}/find/${id}`);

        if (!response.ok) {
            throw new Error("Travel plan not found");
        }

        const plan = await response.json();

        editingPlan = plan;

        document.getElementById("planId").value = plan.planId;
        document.getElementById("planName").value = plan.planName;
        document.getElementById("planminBudget").value = plan.planminBudget;
        document.getElementById("planDescription").value = plan.planDescription;
        document.getElementById("planCategoryId").value = plan.planCategoryId;
        document.getElementById("activateSW").value = plan.activateSW;

        document.getElementById("formTitle").textContent = "Update Travel Plan";
        document.getElementById("saveButton").textContent = "Update Plan";
        document.getElementById("cancelButton").hidden = false;

        document.getElementById("form-section").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Delete travel plan
async function deleteTravelPlan(id) {

    if (!confirm("Are you sure you want to delete this travel plan?")) {
        return;
    }

    try {
        const response = await fetch(`${API}/delete/${id}`, {
            method: "DELETE"
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to delete travel plan");
        }

        showMessage(result || "Travel plan deleted successfully!");

        if (editingPlan?.planId === id) {
            resetForm();
        }

        await loadTravelPlans();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Change travel plan status
async function changeStatus(id, status) {

    try {
        const response = await fetch(
            `${API}/status-change/${id}/${encodeURIComponent(status)}`,
            {
                method: "PUT"
            }
        );

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to change status");
        }

        showMessage(result || "Status updated successfully!");

        await loadTravelPlans();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Reset form
function resetForm() {
    document.getElementById("travelPlanForm").reset();

    document.getElementById("planId").value = "";

    document.getElementById("formTitle").textContent =
        "Add New Travel Plan";

    document.getElementById("saveButton").textContent =
        "Save Travel Plan";

    document.getElementById("cancelButton").hidden = true;

    editingPlan = null;
}

// Cancel edit
document.getElementById("cancelButton")
    .addEventListener("click", resetForm);

// Initialize application
async function initializeApplication() {
    await loadCategories();
    await loadTravelPlans();
}

initializeApplication();