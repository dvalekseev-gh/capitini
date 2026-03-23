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
// 1. VIEW NOTICES LOGIC
// ==========================================
const noticeList = document.getElementById('noticeList');

if (noticeList) {
    const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    
    onSnapshot(noticesQuery, (snapshot) => {
        noticeList.innerHTML = ''; 
        
        snapshot.forEach((doc) => {
            const notice = doc.data();
            
            // Format time accurately for Rome
            let dateString = "Just now";
            if (notice.createdAt) {
                const dateObj = notice.createdAt.toDate();
                // Creates a format like: "24 Oct, 14:30" based on Rome time
                dateString = dateObj.toLocaleString('en-GB', { 
                    timeZone: 'Europe/Rome',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // Fallback for name if left blank
            const authorName = notice.name || "Anonymous";

            const article = document.createElement('article');
            article.className = 'notice-card';
            
            const colors = ['#FEDB88', '#AED5E6', '#D4EED8', '#F9E3E4'];
            article.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // The layout is now fully focused on the text and name (no smile icon)
            article.innerHTML = `
                <div class="card-header-area">
                    <span class="author-name">${authorName}</span>
                    <span class="date">${dateString}</span>
                </div>
                <h2>${notice.title}</h2>
                <div class="dialogue-text">${notice.content}</div>
            `;
            noticeList.appendChild(article);
        });
    });
}

// ==========================================
// 2. ADD NOTICE LOGIC
// ==========================================
const addNoticeBtn = document.getElementById('addNoticeBtn');
const postNameInput = document.getElementById('postNameInput');
const noticeTitleInput = document.getElementById('noticeTitleInput');
const noticeContentInput = document.getElementById('noticeContentInput');

if (addNoticeBtn && noticeTitleInput) {
    addNoticeBtn.addEventListener('click', async () => {
        const name = postNameInput.value.trim();
        const title = noticeTitleInput.value.trim();
        const content = noticeContentInput.value.trim();
        
        if (title !== "" && content !== "") {
            addNoticeBtn.textContent = "Posting...";
            await addDoc(collection(db, "notices"), { 
                name: name,
                title: title,
                content: content,
                createdAt: serverTimestamp() 
            });
            window.location.href = "index.html"; 
        }
    });
}

// ==========================================
// 3. MOVIE NIGHT LOGIC
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
        // Changed to sentence case!
        resultDisplay.textContent = "Spinning...";
        
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
