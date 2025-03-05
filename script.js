import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
    const plansList = document.getElementById("plans-list");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const clearBtn = document.getElementById("clear-btn");
    const sortSelect = document.getElementById("sort-options");

    // Cargar planes desde Firestore
    async function loadPlans(sortBy = "timestamp") {
        plansList.innerHTML = ""; // Limpiar lista antes de agregar elementos

        const q = query(collection(db, "plans"), orderBy(sortBy, "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const plan = doc.data();
            createPlanElement(doc.id, plan.text, plan.checked);
        });
    }

    // Crear un elemento de plan en la lista
    function createPlanElement(id, text, checked) {
        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.addEventListener("change", async function () {
            await updateDoc(doc(db, "plans", id), { checked: this.checked });
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(text));

        // Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async function () {
            await deleteDoc(doc(db, "plans", id));
            listItem.remove();
        });

        listItem.appendChild(deleteBtn);
        plansList.appendChild(listItem);
    }

    // Agregar un nuevo plan
    addBtn.addEventListener("click", async function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        const newPlanRef = await addDoc(collection(db, "plans"), {
            text: planText,
            checked: false,
            timestamp: Date.now()
        });

        createPlanElement(newPlanRef.id, planText, false);
        planInput.value = ""; // Limpiar input
    });

    // Botón para desmarcar todo
    clearBtn.addEventListener("click", async function () {
        const querySnapshot = await getDocs(collection(db, "plans"));
        querySnapshot.forEach(async (documento) => {
            await updateDoc(doc(db, "plans", documento.id), { checked: false });
        });
        loadPlans();
    });

    // Ordenar la lista
    sortSelect.addEventListener("change", function () {
        const sortBy = this.value === "checked" || this.value === "unchecked" ? "checked" : "timestamp";
        loadPlans(sortBy);
    });

    // Cargar planes al inicio
    loadPlans();
});
