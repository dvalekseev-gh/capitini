// 1. Import all the Firebase tools we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. PASTE YOUR FIREBASE CONFIG HERE:
const firebaseConfig = {
  apiKey: "AIzaSyBivILhcP8I2XjKPCc-QbDNs9sLVZgrcls",
  authDomain: "capitini-5dfff.firebaseapp.com",
  projectId: "capitini-5dfff",
  storageBucket: "capitini-5dfff.firebasestorage.app",
  messagingSenderId: "413960521320",
  appId: "1:413960521320:web:db56bc73fc090e7aa09ddd"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// NOTICE BOARD LOGIC (Runs only on index.html)
// ==========================================
const noticeTitleInput = document.getElementById('noticeTitleInput');
const noticeContentInput = document.getElementById('noticeContentInput');
const addNoticeBtn = document.getElementById('addNoticeBtn');
const noticeList = document.getElementById('noticeList');

if (addNoticeBtn && noticeList) {
    // Listen to the "notices" collection, ordered by newest first
    const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    
    onSnapshot(noticesQuery, (snapshot) => {
        noticeList.innerHTML = ''; // Clear the screen
        
        snapshot.forEach((doc) => {
            const notice = doc.data();
            
            // Format the date to look like "OCT 24"
            let dateString = "NEW";
            if (notice.createdAt) {
                const dateObj = notice.createdAt.toDate();
                const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                const day = dateObj.getDate();
                dateString = `${month} ${day}`;
            }

            // Create the friendly notice card HTML
            const article = document.createElement('article');
            article.className = 'notice-card';
            // Alternate colors randomly for that Animal Crossing vibe
            const colors = ['#FEDB88', '#AED5E6', '#D4EED8', '#F9E3E4'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            article.style.backgroundColor = randomColor;

            article.innerHTML = `
                <div class="card-icon-area">
                    <svg class="friendly-icon" width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FBF9F6" fill-opacity="0.5"/><path d="M50 25C36.2 25 25 36.2 25 50C25 63.8 36.2 75 50 75C63.8 75 75 63.8 75 50" stroke="#74664B" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="45" r="5" fill="#74664B"/><circle cx="60" cy="45" r="5" fill="#74664B"/><path d="M45 60C45 60 48 65 55 60" stroke="#74664B" stroke-width="5" stroke-linecap="round"/></svg>
                </div>
                <div class="card-content-area">
                    <div class="date">${dateString}</div>
                    <h2>${notice.title}</h2>
                    <p class="dialogue-text">${notice.content}</p>
                </div>
            `;
            noticeList.appendChild(article);
        });
    });

    // Add a new notice to Firebase
    addNoticeBtn.addEventListener('click', async () => {
        const title = noticeTitleInput.value.trim();
        const content = noticeContentInput.value.trim();
        
        if (title !== "" && content !== "") {
            addNoticeBtn.textContent = "Posting...";
            await addDoc(collection(db, "notices"), { 
                title: title,
                content: content,
                createdAt: serverTimestamp() // Tags it with the exact server time
            });
            // Clear inputs after posting
            noticeTitleInput.value = '';
            noticeContentInput.value = '';
            addNoticeBtn.textContent = "Post Announcement";
        }
    });
}


// ==========================================
// MOVIE NIGHT LOGIC (Runs only on movies.html)
// ==========================================
const movieInput = document.getElementById('movieInput');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieList = document.getElementById('movieList');
const pickRandomBtn = document.getElementById('pickRandomBtn');
const resultDisplay = document.getElementById('resultDisplay');

let movies = []; 

if (addMovieBtn && movieList) {
    // Listen to Firebase "movies" collection
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

    // Pick Random Movie (Spinning Effect)
    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) {
            resultDisplay.textContent = "THE LIST IS EMPTY!";
            resultDisplay.style.color = 'rgba(116, 102, 75, 0.6)';
            return;
        }
        
        pickRandomBtn.disabled = true; 
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
                let speedDelay = initialSpeed + (count * 15);
                setTimeout(spin, speedDelay);
            } else {
                const finalChoiceIndex = Math.floor(Math.random() * movies.length);
                resultDisplay.textContent = `▶ ${movies[finalChoiceIndex]} 🍿`;
                resultDisplay.style.color = 'var(--text-color)';
                pickRandomBtn.disabled = false;
            }
        }
        
        setTimeout(spin, initialSpeed);
    });
}
