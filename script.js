import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const plansRef = ref(database, 'plans');

// Función para guardar datos
function savePlan(planText) {
    const newPlanKey = ref(database, 'plans').push().key;
    set(ref(database, 'plans/' + newPlanKey), {
        text: planText,
        checked: false
    });
}


// Función para cargar los planes desde Firebase
function loadPlans() {
    plansRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const plansList = document.getElementById("plans-list");
        plansList.innerHTML = ''; // Limpiar la lista antes de cargar los nuevos planes

        for (let key in data) {
            const plan = data[key];
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener('change', () => toggleChecked(key, checkbox.checked));

            const text = document.createElement("span");
            text.textContent = plan.text;

            li.appendChild(checkbox);
            li.appendChild(text);
            plansList.appendChild(li);
        }
    });
}

// Función para actualizar el estado del plan (marcar/desmarcar)
function toggleChecked(planId, isChecked) {
    firebase.database().ref('plans/' + planId).update({
        checked: isChecked
    });
}

// Función para manejar el evento de añadir un nuevo plan
document.getElementById("add-btn").addEventListener("click", () => {
    const newPlanText = document.getElementById("new-plan").value.trim();
    if (newPlanText) {
        savePlan(newPlanText);
        document.getElementById("new-plan").value = ''; // Limpiar el campo de entrada
    }
});

// Función para desmarcar todos los planes
document.getElementById("clear-btn").addEventListener("click", () => {
    const plans = document.querySelectorAll("#plans-list input[type='checkbox']");
    plans.forEach(checkbox => {
        checkbox.checked = false;
        toggleChecked(checkbox.parentElement.textContent, false); // Desmarcar en Firebase
    });
});

// Cargar los planes cuando se cargue la página
window.onload = function () {
    loadPlans();
};

// Función para ordenar los planes
document.getElementById("sort-options").addEventListener("change", function () {
    const criterion = this.value;

    plansRef.once('value', (snapshot) => {
        const data = snapshot.val();
        let sortedPlans = Object.keys(data).map(key => ({ ...data[key], id: key }));

        if (criterion === 'newest') {
            sortedPlans.sort((a, b) => b.timestamp - a.timestamp);
        } else if (criterion === 'oldest') {
            sortedPlans.sort((a, b) => a.timestamp - b.timestamp);
        } else if (criterion === 'checked') {
            sortedPlans.sort((a, b) => b.checked - a.checked);
        } else if (criterion === 'unchecked') {
            sortedPlans.sort((a, b) => a.checked - b.checked);
        }

        // Volver a cargar la lista ordenada
        const plansList = document.getElementById("plans-list");
        plansList.innerHTML = '';
        sortedPlans.forEach(plan => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener('change', () => toggleChecked(plan.id, checkbox.checked));

            const text = document.createElement("span");
            text.textContent = plan.text;

            li.appendChild(checkbox);
            li.appendChild(text);
            plansList.appendChild(li);
        });
    });
});
