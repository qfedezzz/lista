import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
    const checkboxesContainer = document.getElementById("plans-list");
    const addBtn = document.getElementById("add-btn");
    const planInput = document.getElementById("new-plan");

    const plansCollection = collection(db, "planes"); // Conectar a la colección "planes"

    // Función para agregar un nuevo plan
    addBtn.addEventListener("click", async function () {
        const planText = planInput.value.trim();
        if (planText === "") return;

        try {
            await addDoc(plansCollection, { text: planText, checked: false, timestamp: Date.now() });
            planInput.value = ""; // Limpiar input después de agregar
        } catch (error) {
            console.error("Error al agregar plan:", error);
        }
    });

    // Función para mostrar los planes en la lista
    function updatePlanList(snapshot) {
        checkboxesContainer.innerHTML = ""; // Limpiar la lista antes de renderizar
        snapshot.forEach(docSnap => {
            const plan = docSnap.data();
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = plan.checked;
            checkbox.addEventListener("change", async function () {
                try {
                    await updateDoc(doc(db, "planes", docSnap.id), { checked: this.checked });
                } catch (error) {
                    console.error("Error al actualizar:", error);
                }
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(plan.text));

            // Botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", async function () {
                try {
                    await deleteDoc(doc(db, "planes", docSnap.id));
                } catch (error) {
                    console.error("Error al eliminar:", error);
                }
            });

            listItem.appendChild(deleteBtn);
            checkboxesContainer.appendChild(listItem);
        });
    }

    // Suscribirse en tiempo real para actualizar la lista cuando haya cambios
    onSnapshot(plansCollection, updatePlanList);
});
