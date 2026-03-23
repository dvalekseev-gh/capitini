import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// PASTE YOUR FIREBASE CONFIG HERE:
const firebaseConfig = {
  apiKey: "AIzaSyBivILhcP8I2XjKPCc-QbDNs9sLVZgrcls",
  authDomain: "capitini-5dfff.firebaseapp.com",
  projectId: "capitini-5dfff",
  storageBucket: "capitini-5dfff.firebasestorage.app",
  messagingSenderId: "413960521320",
  appId: "1:413960521320:web:db56bc73fc090e7aa09ddd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 1. VIEW NOTICES LOGIC (Runs on index.html)
// ==========================================
const noticeList = document.getElementById('noticeList');

if (noticeList) {
    const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    
    onSnapshot(noticesQuery, (snapshot) => {
        noticeList.innerHTML = ''; 
        
        snapshot.forEach((doc) => {
            const notice = doc.data();
            
            let dateString = "NEW";
            if (notice.createdAt) {
                const dateObj = notice.createdAt.toDate();
                const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
                const day = dateObj.getDate();
                dateString = `${month} ${day}`;
            }

            const article = document.createElement('article');
            article.className = 'notice-card';
            
            // Apply soft AC pastel colors to the cards
            const colors = ['#FEDB88', '#AED5E6', '#D4EED8', '#F9E3E4'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            article.style.backgroundColor = randomColor;

            // This HTML exactly matches the CSS classes to keep the design beautiful
            article.innerHTML = `
                <div class="card-icon-area">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FBF9F6" fill-opacity="0.6"/><path d="M50 25C36.2 25 25 36.2 25 50C25 63.8 36.2 75 50 75C63.8 75 75 63.8 75 50" stroke="#74664B" stroke-width="5" stroke-linecap="round"/><circle cx="40" cy="45" r="5" fill="#74664B"/><circle cx="60" cy="45" r="5" fill="#74664B"/><path d="M45 60C45 60 48 65 55 60" stroke="#74664B" stroke-width="5" stroke-linecap="round"/></svg>
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
}

// ==========================================
// 2. ADD NOTICE LOGIC (Runs on add-notice.html)
// ==========================================
const addNoticeBtn = document.getElementById('addNoticeBtn');
const noticeTitleInput = document.getElementById('noticeTitleInput');
const noticeContentInput = document.getElementById('noticeContentInput');

if (addNoticeBtn && noticeTitleInput) {
    addNoticeBtn.addEventListener('click', async () => {
        const title = noticeTitleInput.value.trim();
        const content = noticeContentInput.value.trim();
        
        if (title !== "" && content !== "") {
            addNoticeBtn.textContent = "Posting...";
            await addDoc(collection(db, "notices"), { 
                title: title,
                content: content,
                createdAt: serverTimestamp() 
            });
            // Send the user back to the main board after posting!
            window.location.href = "index.html"; 
        }
    });
}

// ==========================================
// 3. MOVIE NIGHT LOGIC (Runs on movies.html)
// ==========================================
const movieInput = document.getElementById('movieInput');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieList = document.getElementById('movieList');
const pickRandomBtn = document.getElementById('pickRandomBtn');
const resultDisplay = document.getElementById('resultDisplay');

if (addMovieBtn && movieList) {
    let movies = []; 
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

    addMovieBtn.addEventListener('click', async () => {
        const title = movieInput.value.trim();
        if (title !== "") {
            await addDoc(collection(db, "movies"), { title: title });
            movieInput.value = ''; 
        }
    });

    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) return;
        
        pickRandomBtn.disabled = true; 
        resultDisplay.textContent = "SPINNING...";
        
        let count = 0;
        function spin() {
            resultDisplay.textContent = movies[Math.floor(Math.random() * movies.length)];
            count++;
            if (count < 12) {
                setTimeout(spin, 80 + (count * 15));
            } else {
                resultDisplay.textContent = `▶ ${movies[Math.floor(Math.random() * movies.length)]} 🍿`;
                pickRandomBtn.disabled = false;
            }
        }
        setTimeout(spin, 80);
    });
}
