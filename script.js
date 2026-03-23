import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// PASTE YOUR FIREBASE CONFIG HERE:
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 1. VIEW POSTS LOGIC (index.html)
// ==========================================
const noticeList = document.getElementById('noticeList');

if (noticeList) {
    const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    
    onSnapshot(noticesQuery, (snapshot) => {
        noticeList.innerHTML = ''; 
        
        snapshot.forEach((doc) => {
            const notice = doc.data();
            
            let dateString = "Just now";
            if (notice.createdAt) {
                const dateObj = notice.createdAt.toDate();
                dateString = dateObj.toLocaleString('en-GB', { 
                    timeZone: 'Europe/Rome',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            const authorName = notice.name || "Anonymous";

            const article = document.createElement('article');
            article.className = 'notice-card';
            
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
// 2. ADD POST LOGIC (add-notice.html)
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
// 3. MOVIE PROPOSALS LOGIC (movies.html)
// ==========================================
const movieInput = document.getElementById('movieInput');
const movieProposerInput = document.getElementById('movieProposerInput');
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
            const data = doc.data();
            const movieTitle = data.title;
            const proposer = data.proposer || "Anonymous"; 
            
            movies.push({ title: movieTitle, proposer: proposer }); 
            
            const li = document.createElement('li');
            li.innerHTML = `<strong>${movieTitle}</strong> <span style="opacity: 0.6; font-size: 0.9em;">(by ${proposer})</span>`;
            movieList.appendChild(li);
        });
    });

    addMovieBtn.addEventListener('click', async () => {
        const title = movieInput.value.trim();
        const proposer = movieProposerInput.value.trim();
        
        if (title !== "") {
            await addDoc(collection(db, "movies"), { 
                title: title,
                proposer: proposer 
            });
            movieInput.value = ''; 
        }
    });

    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) return;
        
        pickRandomBtn.disabled = true; 
        resultDisplay.textContent = "Spinning...";
        
        let count = 0;
        function spin() {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            resultDisplay.textContent = randomMovie.title; 
            
            count++;
            if (count < 12) {
                setTimeout(spin, 80 + (count * 15));
            } else {
                resultDisplay.innerHTML = `▶ ${randomMovie.title} 🍿 <br><span style="font-size: 0.6em; opacity: 0.7;">Proposed by: ${randomMovie.proposer}</span>`;
                pickRandomBtn.disabled = false;
            }
        }
        setTimeout(spin, 80);
    });
}
