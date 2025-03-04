document.addEventListener("DOMContentLoaded", function () {
    const checkboxesContainer = document.getElementById("plans-list");
    const clearBtn = document.getElementById("clear-btn");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const sortSelect = document.getElementById("sort-options");

    // Referencia a la base de datos de Firebase
    const plansRef = firebase.database().ref("plans");

    // Función para leer los planes desde Firebase
    function getPlans() {
        plansRef.on("value", function(snapshot) {
            const savedPlans = snapshot.val() || {};
            updatePlanList(savedPlans);
        });
    }

    // Función para actualizar la lista de planes
    function updatePlanList(savedPlans) {
        checkboxesContainer.innerHTML = ""; // Limpiar la lista actual
        for (const key in savedPlans) {
            const plan = savedPlans[key];
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener("change", function () {
                firebase.database().ref("plans/" + key).update({
                    checked: this.checked
                });
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(plan.text));

            // Crear el botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", function () {
                firebase.database().ref("plans/" + key).remove();
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
        const newPlanRef = plansRef.push();
        newPlanRef.set(newPlan);
        planInput.value = ""; // Limpiar el input
    });

    // Botón para desmarcar todo
    clearBtn.addEventListener("click", function () {
        plansRef.once("value", function(snapshot) {
            const savedPlans = snapshot.val() || {};
            for (const key in savedPlans) {
                plansRef.child(key).update({ checked: false });
            }
        });
    });

    // Evento para cambiar el orden cuando el select cambia
    sortSelect.addEventListener("change", function () {
        const criterion = this.value;
        // Aquí iría el código para ordenar según el criterio seleccionado
        // Por ejemplo, ordenar por la fecha de creación, si se desea
    });
});
