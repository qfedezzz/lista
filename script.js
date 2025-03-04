import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Obtener la instancia de la base de datos
const database = getDatabase();
const plansRef = ref(database, "plans");

console.log("Script cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {
    const checkboxesContainer = document.getElementById("plans-list");
    const clearBtn = document.getElementById("clear-btn");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const sortSelect = document.getElementById("sort-options");

    // Función para leer los planes desde Firebase
    function getPlans() {
        onValue(plansRef, (snapshot) => {
            const savedPlans = snapshot.val() || {};
            updatePlanList(savedPlans);
        });
    }

    // Función para actualizar la lista de planes en la página
    function updatePlanList(savedPlans) {
        checkboxesContainer.innerHTML = ""; // Limpiar la lista actual
        for (const key in savedPlans) {
            const plan = savedPlans[key];
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener("change", function () {
                update(ref(database, "plans/" + key), {
                    checked: this.checked
                });
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(plan.text));

            // Botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", function () {
                remove(ref(database, "plans/" + key));
            });

            listItem.appendChild(deleteBtn);
            checkboxesContainer.appendChild(listItem);
        }
    }

    // Inicializar la lista de planes
    getPlans();

    // Agregar un nuevo plan
    addBtn.addEventListener("click", function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        const newPlan = { text: planText, checked: false };
        const newPlanRef = push(plansRef);
        set(newPlanRef, newPlan);

        planInput.value = ""; // Limpiar el input
    });

    // Botón para desmarcar todo
    clearBtn.addEventListener("click", function () {
        onValue(plansRef, (snapshot) => {
            const savedPlans = snapshot.val() || {};
            Object.keys(savedPlans).forEach((key) => {
                update(ref(database, "plans/" + key), { checked: false });
            });
        });
    });

    // Evento para cambiar el orden cuando el select cambia
    sortSelect.addEventListener("change", function () {
        // Ordenar según el criterio seleccionado
    });
});
