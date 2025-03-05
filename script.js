import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async function () {
    const plansList = document.getElementById("plans-list");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const clearBtn = document.getElementById("clear-btn");
    const sortSelect = document.getElementById("sort-options");

    const plansCollection = collection(db, "planes");

    // Función para renderizar la lista de actividades en tiempo real
    function renderPlans(querySnapshot) {
        plansList.innerHTML = ""; // Limpiamos la lista
        querySnapshot.forEach((doc) => {
            const plan = doc.data();
            const listItem = document.createElement("li");
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener("change", async function () {
                await updateDoc(doc.ref, { checked: this.checked });
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(plan.text));

            // Botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", async function () {
                await deleteDoc(doc.ref);
            });

            listItem.appendChild(deleteBtn);
            plansList.appendChild(listItem);
        });
    }

    // Cargar datos en tiempo real
    onSnapshot(plansCollection, (snapshot) => {
        renderPlans(snapshot);
    });

    // Agregar un nuevo plan
    addBtn.addEventListener("click", async function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        await addDoc(plansCollection, { text: planText, checked: false, timestamp: Date.now() });
        planInput.value = "";
    });

    // Desmarcar todo
    clearBtn.addEventListener("click", async function () {
        const querySnapshot = await getDocs(plansCollection);
        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { checked: false });
        });
    });

    // Cambiar el orden de los elementos
    sortSelect.addEventListener("change", async function () {
        const querySnapshot = await getDocs(plansCollection);
        let sortedPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (this.value === "newest") {
            sortedPlans.sort((a, b) => b.timestamp - a.timestamp);
        } else if (this.value === "oldest") {
            sortedPlans.sort((a, b) => a.timestamp - b.timestamp);
        } else if (this.value === "checked") {
            sortedPlans.sort((a, b) => b.checked - a.checked);
        } else if (this.value === "unchecked") {
            sortedPlans.sort((a, b) => a.checked - b.checked);
        }

        renderPlans({ forEach: callback => sortedPlans.forEach(callback) });
    });
});
