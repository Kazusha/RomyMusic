const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("bg-red-50", "font-semibold");
          if(link.getAttribute("href") === `#${id}`){
            link.classList.add("bg-red-50", "font-semibold");
          }
        });
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));
//Fonction pour top Monde 
const top_musique = document.getElementById("top_musique");
let allSongs = [];
let currentIndex = 0;
const songsPerPage = 5;

async function getTopMonde() {
  const url = "https://itunes.apple.com/us/rss/topsongs/limit=20/json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    allSongs = data.feed.entry;
    displayPage(currentIndex);
  } catch(error) {
    console.error("Erreur Top Monde:", error);
    top_musique.innerHTML = "<p class='text-red-500'>Impossible de charger le Top Monde</p>";
  }
}
//Affichage HTML pour la fonction top monde 
function displayPage(startIndex) {
  top_musique.innerHTML = "";
  const pageSongs = allSongs.slice(startIndex, startIndex + songsPerPage);

  pageSongs.forEach((song, index) => {
    // La correction est ici : on cherche l'URL de preview dans le tableau link
    const previewUrl = song.link[1].attributes.href; 
    const coverImage = song["im:image"][2].label;

    const card = document.createElement("div");
    card.className = `flex flex-col items-center gap-2 bg-white p-4 rounded-lg shadow-md w-40 sm:w-44 md:w-48 opacity-0 translate-x-8 transition-all duration-500 hover:scale-105 hover:shadow-xl`;

    card.innerHTML = `
      <img src="${coverImage}" class="w-24 h-24 rounded-lg">
      <p class="font-semibold text-sm text-center mt-2 h-10 overflow-hidden">${song["im:name"].label}</p>
      <audio controls class="w-full mt-2 h-8">
          <source src="${previewUrl}" type="audio/mp4">
      </audio>
    `;

    top_musique.appendChild(card);
    
    setTimeout(() => {
      card.classList.remove("opacity-0", "translate-x-8");
    }, index * 100);
  });
}


//Animation card 5-5 avec bouton previous 
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

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
//Appel de fonction
getTopMonde();

// Fonction pour recommandation aleatoire