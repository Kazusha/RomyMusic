// ================================
// Sidebar & navigation
// ================================
const links = document.querySelectorAll(".nav-link");
const main = document.getElementById("main-content");

function loadPage(page) {
  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      if(page === "accueil") initAccueil();
      if(page === "top") initTopMondePage();
      if(page === "recommandations") initRecommandationsPage();

      // Lien actif
      links.forEach(link => link.classList.remove("bg-[#B23EFF]/20", "font-bold"));
      const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
      if(activeLink) activeLink.classList.add("bg-[#B23EFF]/20", "font-bold");
    });
}

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    loadPage(link.dataset.page);
  });
});

loadPage("accueil");

// ================================
// Player global
// ================================
const musicPlayer = document.getElementById("music-player");
const playerCover = document.getElementById("player-cover");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerAudio = document.getElementById("player-audio");
const closePlayer = document.getElementById("close-player");

function playSong(song) {
  playerCover.src = song.cover;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  playerAudio.src = song.preview;
  playerAudio.play();
  musicPlayer.classList.remove("hidden");
}

closePlayer.addEventListener("click", () => {
  playerAudio.pause();
  musicPlayer.classList.add("hidden");
});

// ================================
// Accueil
// ================================
function initAccueil() {
  // ===== TOP MUSIQUES =====
  const top_musique = document.getElementById("top_musique");
  const prevBtnTop = document.getElementById("prev");
  const nextBtnTop = document.getElementById("next");
  const searchInput = document.getElementById("rechercher");
  const results = document.getElementById("results");

  let allSongsTop = [];
  let currentIndexTop = 0;
  const songsPerPageTop = 5;

  async function getTopMonde() {
    const url = "https://itunes.apple.com/us/rss/topsongs/limit=50/json";
    try {
      const response = await fetch(url);
      const data = await response.json();
      allSongsTop = data.feed.entry;
      displayPageTop(currentIndexTop);
    } catch (error) {
      top_musique.innerHTML = "<p class='text-red-500'>Impossible de charger le Top Monde</p>";
    }
  }

  function displayPageTop(startIndex) {
    top_musique.innerHTML = "";
    const pageSongs = allSongsTop.slice(startIndex, startIndex + songsPerPageTop);

    pageSongs.forEach((song, index) => {
      const previewUrl = song.link[1].attributes.href; 
      const coverImage = song["im:image"][2].label;

      const card = document.createElement("div");
      card.className = `flex flex-col items-center gap-2 bg-[#1e1e1e] p-4 shadow-md w-40 sm:w-44 md:w-48 opacity-0 translate-x-8 transition-all duration-500 hover:scale-105 hover:shadow-xl`;

      card.innerHTML = `
        <img src="${coverImage}" class="w-32 h-32">
        <p class="font-sans text-white text-sm text-center mt-2 h-10 overflow-hidden">${song["im:name"].label}</p>
        <button class="play-btn bg-[#B23EFF] text-white px-2 py-1 rounded">Play</button>
      `;

      card.querySelector(".play-btn").addEventListener("click", () => {
        playSong({
          cover: coverImage,
          title: song["im:name"].label,
          artist: song["im:artist"].label,
          preview: previewUrl
        });
      });

      top_musique.appendChild(card);
      setTimeout(() => card.classList.remove("opacity-0", "translate-x-8"), index*100);
    });
  }

  nextBtnTop.addEventListener("click", () => {
    if(currentIndexTop + songsPerPageTop < allSongsTop.length){
      currentIndexTop += songsPerPageTop;
      displayPageTop(currentIndexTop);
    }
  });

  prevBtnTop.addEventListener("click", () => {
    if(currentIndexTop - songsPerPageTop >= 0){
      currentIndexTop -= songsPerPageTop;
      displayPageTop(currentIndexTop);
    }
  });

  getTopMonde();

  // ===== RECHERCHE =====
  window.searchArtist = async function() {
    const query = searchInput.value;
    if(!query) return;
    results.innerHTML = "<p class='text-white animate-pulse'>Recherche en cours...</p>";

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20&country=fr`;
      const response = await fetch(url);
      const data = await response.json();
      results.innerHTML = "";

      if(data.results.length === 0) {
        results.innerHTML = "<p class='text-white'>Aucun résultat trouvé.</p>";
        return;
      }

      data.results.forEach(track => {
        const cover = track.artworkUrl100.replace("100x100","300x300");

        const card = document.createElement("div");
        card.className = "bg-[#2a2a2a] p-4 rounded-xl w-48 flex flex-col items-center gap-3 hover:border-[#B23EFF] border border-transparent transition shadow-lg";
        card.innerHTML = `
          <img src="${cover}" class="w-36 h-36 rounded-lg shadow-md">
          <div class="text-center w-full">
            <p class="text-white font-bold text-sm truncate">${track.trackName}</p>
            <p class="text-gray-400 text-xs truncate">${track.artistName}</p>
          </div>
          <button class="play-btn bg-[#B23EFF] text-white px-2 py-1 rounded">Play</button>
        `;

        card.querySelector(".play-btn").addEventListener("click", () => {
          playSong({
            cover: cover,
            title: track.trackName,
            artist: track.artistName,
            preview: track.previewUrl
          });
        });

        results.appendChild(card);
      });

    } catch(error) {
      results.innerHTML = "<p class='text-red-500'>Erreur de connexion.</p>";
    }
  }

  // ===== RECOMMANDATIONS (TOP ARTISTES) =====
  const recommandations = document.getElementById("recommandations");
  const prevBtnReco = document.getElementById("previous");
  const nextBtnReco = document.getElementById("nexteoiuws");

  const artistes = [
    { name: "Artist 1", img: "images/artist1.jpg" },
    { name: "Artist 2", img: "images/artist2.jpg" },
    { name: "Artist 3", img: "images/artist3.jpg" },
    { name: "Artist 4", img: "images/artist4.jpg" },
    { name: "Artist 5", img: "images/artist5.jpg" },
    { name: "Artist 6", img: "images/artist6.jpg" },
  ];

  let currentIndexReco = 0;
  const perPageReco = 4;

  function displayArtists(startIndex) {
    recommandations.innerHTML = "";
    const pageArtists = artistes.slice(startIndex, startIndex + perPageReco);

    pageArtists.forEach((art) => {
      const card = document.createElement("div");
      card.className = `flex flex-col items-center gap-2 bg-[#1e1e1e] p-4 shadow-md w-40 sm:w-44 md:w-48 hover:scale-105 hover:shadow-xl transition`;
      card.innerHTML = `
        <img src="${art.img}" class="w-32 h-32 rounded-lg">
        <p class="font-sans text-white text-sm text-center mt-2 h-10 overflow-hidden">${art.name}</p>
      `;
      recommandations.appendChild(card);
    });
  }

  nextBtnReco.addEventListener("click", () => {
    if(currentIndexReco + perPageReco < artistes.length){
      currentIndexReco += perPageReco;
      displayArtists(currentIndexReco);
    }
  });

  prevBtnReco.addEventListener("click", () => {
    if(currentIndexReco - perPageReco >= 0){
      currentIndexReco -= perPageReco;
      displayArtists(currentIndexReco);
    }
  });

  displayArtists(currentIndexReco);
}

// ================================
// Top Monde (page séparée)
// ================================
function initTopMondePage() {
  const top_musique = document.getElementById("top_musique");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let allSongs = [];
  let currentIndex = 0;
  const songsPerPage = 5;

  async function getTopMonde() {
    const url = "https://itunes.apple.com/us/rss/topsongs/limit=50/json";
    try {
      const response = await fetch(url);
      const data = await response.json();
      allSongs = data.feed.entry;
      displayPage(currentIndex);
    } catch (error) {
      top_musique.innerHTML = "<p class='text-red-500'>Impossible de charger le Top Monde</p>";
    }
  }

  function displayPage(startIndex) {
    top_musique.innerHTML = "";
    const pageSongs = allSongs.slice(startIndex, startIndex + songsPerPage);

    pageSongs.forEach((song, index) => {
      const previewUrl = song.link[1].attributes.href; 
      const coverImage = song["im:image"][2].label;

      const card = document.createElement("div");
      card.className = `flex flex-col items-center gap-2 bg-[#1e1e1e] p-4 shadow-md w-40 sm:w-44 md:w-48 opacity-0 translate-x-8 transition-all duration-500 hover:scale-105 hover:shadow-xl`;

      card.innerHTML = `
        <img src="${coverImage}" class="w-32 h-32">
        <p class="font-sans text-white text-sm text-center mt-2 h-10 overflow-hidden">${song["im:name"].label}</p>
        <button class="play-btn bg-[#B23EFF] text-white px-2 py-1 rounded">Play</button>
      `;

      card.querySelector(".play-btn").addEventListener("click", () => {
        playSong({
          cover: coverImage,
          title: song["im:name"].label,
          artist: song["im:artist"].label,
          preview: previewUrl
        });
      });

      top_musique.appendChild(card);
      setTimeout(() => card.classList.remove("opacity-0", "translate-x-8"), index*100);
    });
  }

  nextBtn.addEventListener("click", () => {
    if(currentIndex + songsPerPage < allSongs.length){
      currentIndex += songsPerPage;
      displayPage(currentIndex);
    }
  });

  prevBtn.addEventListener("click", () => {
    if(currentIndex - songsPerPage >= 0){
      currentIndex -= songsPerPage;
      displayPage(currentIndex);
    }
  });

  getTopMonde();
}

// ================================
// Recommandations (page séparée)
// ================================
function initRecommandationsPage() {
  const recommandations = document.getElementById("recommandations");
  const prevBtn = document.getElementById("previous");
  const nextBtn = document.getElementById("nexteoiuws");

  const artistes = [
    { name: "Artist 1", img: "images/artist1.jpg" },
    { name: "Artist 2", img: "images/artist2.jpg" },
    { name: "Artist 3", img: "images/artist3.jpg" },
    { name: "Artist 4", img: "images/artist4.jpg" },
    { name: "Artist 5", img: "images/artist5.jpg" },
    { name: "Artist 6", img: "images/artist6.jpg" },
  ];

  let currentIndex = 0;
  const perPage = 4;

  function displayArtists(startIndex) {
    recommandations.innerHTML = "";
    const pageArtists = artistes.slice(startIndex, startIndex + perPage);

    pageArtists.forEach((art) => {
      const card = document.createElement("div");
      card.className = `flex flex-col items-center gap-2 bg-[#1e1e1e] p-4 shadow-md w-40 sm:w-44 md:w-48 hover:scale-105 hover:shadow-xl transition`;
      card.innerHTML = `
        <img src="${art.img}" class="w-32 h-32 rounded-lg">
        <p class="font-sans text-white text-sm text-center mt-2 h-10 overflow-hidden">${art.name}</p>
      `;
      recommandations.appendChild(card);
    });
  }

  nextBtn.addEventListener("click", () => {
    if(currentIndex + perPage < artistes.length){
      currentIndex += perPage;
      displayArtists(currentIndex);
    }
  });

  prevBtn.addEventListener("click", () => {
    if(currentIndex - perPage >= 0){
      currentIndex -= perPage;
      displayArtists(currentIndex);
    }
  });

  displayArtists(currentIndex);
}