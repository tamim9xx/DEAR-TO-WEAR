import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Replace with your real Firebase Project Config credentials
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "dare-to-wear.firebaseapp.com",
    projectId: "dare-to-wear",
    storageBucket: "dare-to-wear.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Cart LocalStorage State Helper
export function getCart() {
    return JSON.parse(localStorage.getItem('dtw_cart') || '[]');
}

export function saveCart(cart) {
    localStorage.setItem('dtw_cart', JSON.stringify(cart));
    updateCartBadge();
}

export function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Global Auth State Handler
export function setupAuthUI() {
    onAuthStateChanged(auth, async (user) => {
        const authLink = document.getElementById('authNavContainer');
        const adminLinks = document.querySelectorAll('.admin-only');

        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : { role: 'user' };

            adminLinks.forEach(el => el.style.display = (userData.role === 'admin') ? 'inline-block' : 'none');

            if (authLink) {
                authLink.innerHTML = `
                    <a href="profile.html">Profile</a>
                    <a href="#" id="logoutBtn" style="color: var(--red-alert); margin-left: 15px;">Logout</a>
                `;
                document.getElementById('logoutBtn')?.addEventListener('click', () => {
                    signOut(auth).then(() => window.location.href = 'login.html');
                });
            }
        } else {
            adminLinks.forEach(el => el.style.display = 'none');
            if (authLink) {
                authLink.innerHTML = `<a href="login.html">Auth Portal</a>`;
            }
        }
    });
}
