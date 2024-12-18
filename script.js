function createVideo(video) {
  const title = video.title || video.name;
  const overview = video.overview || "No overview available";

  return `
    <div class="swiper-slide">
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500${video.poster_path}" class="card-img-top" alt="Thumbnail for ${video.title}"/>
        <div class="card-img-overlay">
          <img src="images/play.svg" alt="Play button" width="64px" class="play-overlay"/>
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <p class="card-text">${overview}</p>
          <button class="watchlist-btn" aria-label="Add to watchlist" data-movie-id="${video.id}">
            <span>+</span>
          </button>
        </div>
      </div>
    </div>`;
}

function loadVideos(apiUrl, containerSelector) {

  const loader = $(`${containerSelector} .loader`);
  const videoCarousel = $(`${containerSelector} .videoCarousel`);


  loader.show();
  videoCarousel.hide();

  $.ajax({
    url: apiUrl,
    method: "GET",
    success: function (data) {
      console.log(data.results);

      const swiperWrapper = videoCarousel.find(".swiper-wrapper");
      data.results.forEach(function (video) {
        const videoCard = createVideo(video);
        swiperWrapper.append($(videoCard));
      });

      loader.hide();
      videoCarousel.show();

      new Swiper(".swiper", {
        slidesPerView: 6,
        pagination: {
          el: ".swiper-pagination",
        },
      
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          1440: {
            slidesPerView: 7,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 5
          },
          0: {
            slidesPerView: 2,
            spaceBetween: 5
          }
        }
      
        });
      }
  });
}

$(document).ready(function () {
  const apiKey = "1dadcdd2738a471d38d47429d1ce81ca";
  const animatedGenre = `&with_genres=16`;

  

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const formattedDate = threeMonthsAgo.toISOString().split("T")[0];

  //const heroUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}${animatedGenre}&sort_by=popularity.desc&vote_average.gte=6.5&vote_count.gte=100&language=en-US`;

  const newMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}${animatedGenre}&sort_by=release_date.desc&primary_release_date.gte=${formattedDate}&vote_count.gte=10`;

  const actionUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}${animatedGenre}&sort_by=popularity.desc&vote_average.gte=6.5&vote_count.gte=100&with_keywords=179431`;
  const familyUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}${animatedGenre}&sort_by=popularity.desc&vote_average.gte=6.5&vote_count.gte=100&without_keywords=179431,9715`;
  const newTvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}${animatedGenre}&sort_by=release_date.desc&primary_release_date.gte=${formattedDate}&vote_average=6.5&vote_count.gte=100&language=en-US`

  loadVideos(actionUrl, ".action");
  loadVideos(familyUrl, ".family");
  loadVideos(newMoviesUrl, ".newMovies");
  loadVideos(newTvUrl, ".newTv");
});
