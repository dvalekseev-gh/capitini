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

    // Pick Random Movie
    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) {
            resultDisplay.textContent = "LIST IS EMPTY";
            return;
        }
        
        // Add a cool little rolling effect
        let counter = 0;
        const rollInterval = setInterval(() => {
            const randomTemp = Math.floor(Math.random() * movies.length);
            resultDisplay.textContent = movies[randomTemp];
            counter++;
            
            if (counter > 10) {
                clearInterval(rollInterval);
                const finalIndex = Math.floor(Math.random() * movies.length);
                resultDisplay.textContent = `▶ ${movies[finalIndex]}`;
                resultDisplay.style.color = 'var(--text-color)';
            }
        }, 50);
    });
}
