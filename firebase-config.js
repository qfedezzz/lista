// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Configuración de Firebase (REEMPLAZA ESTO CON TU CONFIGURACIÓN)
const firebaseConfig = {
    apiKey: "AIzaSyCHFzGTHNrZKVqpI7wqjOTWCpG_llqonMY",
    authDomain: "lista-12899.firebaseapp.com",
    projectId: "lista-12899",
    storageBucket: "lista-12899.firebasestorage.app",
    messagingSenderId: "841578650890",
    appId: "1:841578650890:web:6d0dd9f655eb230994eef3"
  };

// 🔹 Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot };

