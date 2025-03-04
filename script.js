// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBb22LYa4N0NgFylqrWpcT_noKkIV-c62M",
    authDomain: "lista-planes.firebaseapp.com",
    databaseURL: "https://lista-planes-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lista-planes",
    storageBucket: "lista-planes.firebasestorage.app",
    messagingSenderId: "341913189781",
    appId: "1:341913189781:web:c07774471cc08e9e710a9c",
    measurementId: "G-6B07BN02KY"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();


document.addEventListener("DOMContentLoaded", function () {
    const checkboxesContainer = document.getElementById("plans-list");
    const clearBtn = document.getElementById("clear-btn");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const sortSelect = document.getElementById("sort-options");

    // Cargar las actividades guardadas en localStorage
    const savedPlans = JSON.parse(localStorage.getItem("plans")) || [];

    // Función para ordenar los planes
    function sortPlans(criterion) {
        if (criterion === 'newest') {
            savedPlans.sort((a, b) => b.timestamp - a.timestamp); // Orden por más reciente
        } else if (criterion === 'oldest') {
            savedPlans.sort((a, b) => a.timestamp - b.timestamp); // Orden por más antiguo
        } else if (criterion === 'checked') {
            savedPlans.sort((a, b) => b.checked - a.checked); // Orden por marcados
        } else if (criterion === 'unchecked') {
            savedPlans.sort((a, b) => a.checked - b.checked); // Orden por desmarcados
        }
        updatePlanList();
    }

    // Función para actualizar la lista de planes
    function updatePlanList() {
        checkboxesContainer.innerHTML = ""; // Limpiar la lista actual
        savedPlans.forEach((plan, index) => {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener("change", function () {
                savedPlans[index].checked = this.checked;
                localStorage.setItem("plans", JSON.stringify(savedPlans));
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(plan.text));

            // Crear el botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", function () {
                savedPlans.splice(index, 1); // Eliminar la actividad de la lista
                localStorage.setItem("plans", JSON.stringify(savedPlans));
                updatePlanList(); // Actualizar la lista después de eliminar
            });

            listItem.appendChild(deleteBtn);
            checkboxesContainer.appendChild(listItem);
        });
    }

    // Inicializar la lista de planes
    updatePlanList();

    // Agregar un nuevo plan
    addBtn.addEventListener("click", function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        const newPlan = { text: planText, checked: false, timestamp: Date.now() }; // Añadí timestamp para ordenar
        savedPlans.push(newPlan);
        localStorage.setItem("plans", JSON.stringify(savedPlans));

        updatePlanList(); // Actualizar la lista con el nuevo plan
        planInput.value = ""; // Limpiar el input
    });

    // Botón para desmarcar todo
    clearBtn.addEventListener("click", function () {
        savedPlans.forEach(plan => plan.checked = false);
        localStorage.setItem("plans", JSON.stringify(savedPlans));
        updatePlanList(); // Actualizar la lista después de desmarcar
    });

    // Evento para cambiar el orden cuando el select cambia
    sortSelect.addEventListener("change", function () {
        sortPlans(this.value); // Ordenar según el criterio seleccionado
    });
});
