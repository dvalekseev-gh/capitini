import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// PASTE YOUR FIREBASE CONFIG HERE:
const firebaseConfig = {
  // apiKey: "...",
  // authDomain: "...",
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const movieInput = document.getElementById('movieInput');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieList = document.getElementById('movieList');
const pickRandomBtn = document.getElementById('pickRandomBtn');
const resultDisplay = document.getElementById('resultDisplay');

let movies = []; 

if (addMovieBtn) {
    // Listen to Firebase
    onSnapshot(collection(db, "movies"), (snapshot) => {
        movies = []; 
        movieList.innerHTML = ''; 

        snapshot.forEach((doc) => {
            const movieTitle = doc.data().title;
            movies.push(movieTitle); 
            
            const li = document.createElement('li');
            li.textContent = movieTitle;
            movieList.appendChild(li);
        });
    });

    // Add Movie
    addMovieBtn.addEventListener('click', async () => {
        const title = movieInput.value.trim();
        if (title !== "") {
            await addDoc(collection(db, "movies"), { title: title });
            movieInput.value = ''; 
        }
    });

    // Pick Random Movie (Refined Spinning Effect)
    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) {
            resultDisplay.textContent = "THE LIST IS EMPTY!";
            resultDisplay.style.color = 'rgba(116, 102, 75, 0.6)'; // Soft sepia for empty
            return;
        }
        
        pickRandomBtn.disabled = true; // prevent multi-click
        resultDisplay.textContent = "SPINNING...";
        resultDisplay.style.color = 'var(--text-color)';

        let count = 0;
        const totalSpins = 12;
        const initialSpeed = 80;
        
        function spin() {
            const randomIndex = Math.floor(Math.random() * movies.length);
            resultDisplay.textContent = movies[randomIndex];
            
            count++;
            if (count < totalSpins) {
                // Add a small delay that increases to look like a spin slowing down
                let speedDelay = initialSpeed + (count * 15);
                setTimeout(spin, speedDelay);
            } else {
                // Land on the final choice
                const finalChoiceIndex = Math.floor(Math.random() * movies.length);
                resultDisplay.textContent = `▶ ${movies[finalChoiceIndex]} 🍿`;
                resultDisplay.style.color = 'var(--text-color)';
                pickRandomBtn.disabled = false;
            }
        }
        
        setTimeout(spin, initialSpeed);
    });
}
