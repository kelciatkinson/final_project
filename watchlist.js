document.addEventListener('DOMContentLoaded', function() {
  function getWatchList() {
    let watchlist = Cookies.get("watchlist");
    return watchlist ? JSON.parse(watchlist) : [];
  }

  function saveWatchList(watchlist) {
    Cookies.set("watchlist", JSON.stringify(watchlist), { expires: 365 });
  }

  function addToWatchList(videoId, title, posterPath, overview) {
    let watchlist = getWatchList();

    if (!watchlist.some(item => item.id === videoId)) {
      watchlist.push({
        id: videoId,
        title: title,
        posterPath: posterPath,
        overview: overview
      });

      saveWatchList(watchlist);
      updateWatchListButton(videoId, true);
    }
  }

  function removeFromWatchList(videoId) {
    let watchlist = getWatchList();
    watchlist = watchlist.filter(item => item.id !== videoId);
    saveWatchList(watchlist);
    updateWatchListButton(videoId, false);
  }

  function updateWatchListButton(videoId, isAdded) {
    const button = document.querySelector(`.watchlist-btn[data-movie-id="${videoId}"]`);
    if (button) {
      if (isAdded) {
        button.classList.add("added");
        button.querySelector("span").textContent = "✓";
      } else {
        button.classList.remove("added");
        button.querySelector("span").textContent = "+";
      }
    }
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.watchlist-btn')) {
      e.preventDefault();
      const button = e.target.closest('.watchlist-btn');
      const videoId = button.dataset.movieId;
      const title = button.closest('.card').querySelector('.card-title').textContent;
      const posterPath = button.closest('.card').querySelector('.card-img-top').src;
      const overview = button.closest('.card').querySelector('.card-text').textContent;
      if (button.classList.contains("added")) {
        removeFromWatchList(videoId);
      } else {
        addToWatchList(videoId, title, posterPath, overview);
      }
    }
  });

  function displayWatchList() {
      const watchListContainer = document.querySelector(".watchlist-container");
      if (watchListContainer) {
        const watchlist = getWatchList();
        
        watchListContainer.innerHTML = '';
        
        if (watchlist.length === 0) {
          watchListContainer.innerHTML = "<p>Your watchlist is empty.</p>";
          return;
        }
        
        watchlist.forEach(item => {
          const watchListItem = `
            <div class="watchlist-item" data-movie-id="${item.id}">
              <img src="${item.posterPath}" class="watchlist-img" alt="Thumbnail for ${item.title}">
              <div class="watchlist-img-overlay">
                <img src="images/play.svg" alt="Play button" width="64px" class="watchlist-play-overlay"/>
              </div>
              <div class="watchlist-item-details">
                <h3 class="card-title">${item.title}</h3>
                <p>${item.overview}</p>
                <button class="remove-from-watchlist" data-movie-id="${item.id}">Remove</button>
              </div>
            </div>
            `;
          watchListContainer.insertAdjacentHTML('beforeend', watchListItem);
        });
      }
  }

  document.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-from-watchlist')) {
        const videoId = e.target.dataset.movieId;

        removeFromWatchList(videoId);

        const watchlistItem = e.target.closest('.watchlist-item');
        if (watchlistItem) {
          watchlistItem.remove();
        }

        const watchListContainer = document.querySelector(".watchlist-container");

        if (watchListContainer && !watchListContainer.children.length) {
          watchListContainer.innerHTML = '<p class="empty-list">Your watch list is empty.</p>';
        }
      }
  });

  function getWatchListButtons() {
    const watchlist = getWatchList();
    const buttons = document.querySelectorAll(".watchlist-btn");
    
    buttons.forEach(button => {
      const videoId = button.dataset.movieId;
      const isInWatchList = watchlist.some(item => item.id === videoId);
      updateWatchListButton(videoId, isInWatchList);
    });
  }

  getWatchListButtons();
  displayWatchList();
});
