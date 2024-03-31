document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => {
        const cardContainer = document.querySelector(".card-container");
        const card = document.createElement("div");
        card.classList.add("card");
        const postContent = `
          <div class="post">
            <span class="material-symbols-outlined">
              account_circle
            </span>
            <h3 class="post_user">${post.username}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="100">
              <path fill="#1DA1F2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.94 7.06l-7.53 7.53c-.39.39-1.02.39-1.41 0l-3.53-3.53a.9959.9959 0 0 1 1.41-1.41l2.12 2.12 6.12-6.12a.9959.9959 0 1 1 1.41 1.41z"/>
            </svg>
            <span class="material-symbols-outlined">
              more_horiz
            </span>
          </div>
          <h4 class="content">${post.post.trim()}</h4>
          <h5 class="timeline">${post.time} · ${post.date} · 25M views</h5>
          <div class="p-details">
            <span class="material-symbols-outlined">
              chat
            </span>
            <span class="material-symbols-outlined">
              history
            </span>
            <span class="material-symbols-outlined favorite">
              favorite
            </span>
            <span class="material-symbols-outlined">
              visibility
            </span>
            <span class="material-symbols-outlined">
              bookmark
            </span>
            <span class="material-symbols-outlined">
              share
            </span>
          </div>
        `;
        card.innerHTML = postContent;
        cardContainer.appendChild(card);
        const favoriteIcons = card.querySelectorAll(".favorite");
        let a = 0;
        favoriteIcons.forEach(favorite => {
          favorite.addEventListener('click', () => {
            if (a==1) {
              favorite.style.color = 'white';
              a=0;
            } else {
              favorite.style.color = 'red';
              a=1;
            }
          });
        });
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
