function openBubble(title, description, type) {
    const bubble = document.getElementById('info-bubble');
    const overlay = document.getElementById('bubble-overlay');
    const titleEl = document.getElementById('bubble-title');
    const descEl = document.getElementById('bubble-desc');
    const tagEl = document.getElementById('bubble-tag');

    // Insert text
    titleEl.innerHTML = title;
    descEl.innerHTML = description;

    // Update the tag styling
    tagEl.className = 'notice-tag'; 
    if (type === 'room') {
        tagEl.innerText = 'ROOM';
        tagEl.classList.add('tag-room');
    } else if (type === 'common') {
        tagEl.innerText = 'COMMON AREA';
        tagEl.classList.add('tag-common');
    } else if (type === 'outdoor') {
        tagEl.innerText = 'OUTDOOR';
        tagEl.classList.add('tag-outdoor');
    }

    // Show bubble and background blur
    bubble.style.display = 'block';
    overlay.style.display = 'block';
}

function closeBubble() {
    document.getElementById('info-bubble').style.display = 'none';
    document.getElementById('bubble-overlay').style.display = 'none';
}