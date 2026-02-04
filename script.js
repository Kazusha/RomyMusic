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
      if(page === "top") initTop();
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

 
}

// ================================
// Top Monde (page séparée)
// ================================

function initTop() {
  const searchInputTOP = document.getElementById("rechercherTop");
  const resultat = document.getElementById("resultat");

  window.searchArtistTOP = async function () {
    const query1 = searchInputTOP.value;
    if (!query1) return;

    resultat.innerHTML = "<p class='text-white animate-pulse'>Recherche en cours...</p>";

    try {
      const url1 = `https://itunes.apple.com/search?term=${encodeURIComponent(query1)}&entity=song&limit=20&country=fr`;
      const response1 = await fetch(url1);
      const data1 = await response1.json();
      resultat.innerHTML = "";

      if (data1.results.length === 0) {
        resultat.innerHTML = "<p class='text-white'>Aucun résultat trouvé.</p>";
        return;
      }

      data1.results.forEach(track => {
        const cover = track.artworkUrl100.replace("100x100","300x300");

        const card = document.createElement("div");
        card.className = "bg-[#2a2a2a] p-4 rounded-xl w-48 flex flex-col items-center gap-3 shadow-lg";

        card.innerHTML = `
          <img src="${cover}" class="w-36 h-36 rounded-lg">
          <p class="text-white font-bold text-sm truncate">${track.trackName}</p>
          <p class="text-gray-400 text-xs truncate">${track.artistName}</p>
          <button class="play-btn bg-[#B23EFF] text-white px-2 py-1 rounded">Play</button>
        `;

        card.querySelector(".play-btn").addEventListener("click", () => {
          playSong({
            cover,
            title: track.trackName,
            artist: track.artistName,
            preview: track.previewUrl
          });
        });

        resultat.appendChild(card);
      });

    } catch {
      resultat.innerHTML = "<p class='text-red-500'>Erreur de connexion.</p>";
    }
  };
  const rap = document.getElementById("rap");
const pop = document.getElementById("pop");
const rock = document.getElementById("rock");
const electro = document.getElementById("electro");

rap.onclick = () => top_genre("rap");
pop.onclick = () => top_genre("pop");
rock.onclick = () => top_genre("rock");
electro.onclick = () => top_genre("electro");
}

async function top_genre(genre) {
  const genre_term = {
    rap: "rap",
    pop: "pop",
    rock: "rock",
    electro: "electronic"
  };

  const container = document.getElementById("top_pargenre");
  const title = document.getElementById("genreTitle");

  title.textContent = `Top 50 ${genre.toUpperCase()}`;
  container.innerHTML = "";

  const term = genre_term[genre];

  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=50`
  );
  const data = await res.json();

  data.results.forEach((track, index) => {
    const cover = track.artworkUrl100.replace("100x100","300x300");

    const card = document.createElement("div");
    card.className =
      "min-w-[200px] bg-[#2a2a2a] rounded-xl p-4 shadow-lg hover:scale-105 transition";

    card.innerHTML = `
      <p class="text-white font-bold mb-1">#${index + 1}</p>
      <img src="${cover}" class="w-36 h-36 rounded-lg shadow-md">
      <div class="text-center w-full">
        <p class="text-white font-bold text-sm truncate">${track.trackName}</p>
        <p class="text-gray-400 text-xs truncate">${track.artistName}</p>
      </div>
      <button class="play-btn bg-[#B23EFF] text-white px-2 py-1 rounded">Play</button>
    `;

    card.querySelector(".play-btn").addEventListener("click", () => {
      playSong({
        cover,
        title: track.trackName,
        artist: track.artistName,
        preview: track.previewUrl
      });
    });

    container.appendChild(card);
  });
}

initTop();
