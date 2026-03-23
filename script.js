// Grab the elements from the webpage
const movieInput = document.getElementById('movieInput');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieList = document.getElementById('movieList');
const pickRandomBtn = document.getElementById('pickRandomBtn');
const resultDisplay = document.getElementById('resultDisplay');

// Load movies from local storage (or start with an empty array)
let movies = JSON.parse(localStorage.getItem('dormMovies')) || [];

// Function to update the visual list on the screen
function renderMovies() {
    movieList.innerHTML = ''; // Clear current list
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie;
        movieList.appendChild(li);
    });
}

// If we are on the movies page, run this code
if (addMovieBtn) {
    // Show existing movies right away
    renderMovies();

    // Add a new movie
    addMovieBtn.addEventListener('click', () => {
        const title = movieInput.value.trim();
        
        if (title !== "") {
            movies.push(title); // Add to our list
            localStorage.setItem('dormMovies', JSON.stringify(movies)); // Save to browser
            movieInput.value = ''; // Clear the input box
            renderMovies(); // Update the screen
        }
    });

    // Pick a random movie
    pickRandomBtn.addEventListener('click', () => {
        if (movies.length === 0) {
            resultDisplay.textContent = "The list is empty! Add some movies first.";
            resultDisplay.style.color = "#e74c3c";
            return;
        }
        
        // Math magic to pick a random item from the array
        const randomIndex = Math.floor(Math.random() * movies.length);
        resultDisplay.style.color = "#27ae60";
        resultDisplay.textContent = `🎉 Tonight's movie is: ${movies[randomIndex]}!`;
    });
}
