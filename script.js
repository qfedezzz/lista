import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
    const plansList = document.getElementById("plans-list");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");
    const clearBtn = document.getElementById("clear-btn");

    // 🔹 Escuchar cambios en Firestore en tiempo real
    function listenToFirestore() {
        onSnapshot(collection(db, "plans"), (snapshot) => {
            plansList.innerHTML = ""; // Borra la lista antes de actualizar
            snapshot.forEach(doc => {
                const plan = doc.data();
                createPlanElement(doc.id, plan.text, plan.checked);
            });
        });
    }

    // 🔹 Crear un elemento de plan en la lista (pero sin modificar HTML directamente)
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

        // 🔹 Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async function () {
            await deleteDoc(doc(db, "plans", id));
        });

        listItem.appendChild(deleteBtn);
        plansList.appendChild(listItem);
    }

    // 🔹 Agregar un nuevo plan
    addBtn.addEventListener("click", async function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        await addDoc(collection(db, "plans"), {
            text: planText,
            checked: false,
            timestamp: Date.now()
        });

        planInput.value = ""; // Limpiar input
    });

    // 🔹 Botón para desmarcar todo
    clearBtn.addEventListener("click", async function () {
        const querySnapshot = await getDocs(collection(db, "plans"));
        querySnapshot.forEach(async (documento) => {
            await updateDoc(doc(db, "plans", documento.id), { checked: false });
        });
    });

    // 🔹 Activar escucha en tiempo real
    listenToFirestore();
});
