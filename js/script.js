const apiBaseURL = "https://pokeapi.co/api/v2/pokemon";
const limit = 10; // Cantidad de Pokémon por página
let offset = 0; // Desplazamiento para la paginación
const appDiv = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

// Función para obtener Pokémon de la API
async function fetchPokemon(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error al cargar los datos. Intenta nuevamente.");
    }
}

// Función para mostrar los Pokémon en la interfaz
async function displayPokemon(pokemonList) {
    appDiv.innerHTML = ""; // Limpiar el contenedor
    for (const pokemon of pokemonList) {
        try {
            const pokemonData = await fetchPokemon(pokemon.url);
            const pokemonCard = document.createElement("div");
            pokemonCard.className = "pokemon-card";
            pokemonCard.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h3>${pokemonData.name}</h3>
                <button class="fav-btn" data-name="${pokemonData.name}">⭐</button>
            `;
            appDiv.appendChild(pokemonCard);

            // Listener para añadir/quitar favoritos
            const favBtn = pokemonCard.querySelector(".fav-btn");
            favBtn.addEventListener("click", () => toggleFavorite(pokemonData.name));
        } catch (error) {
            console.error("Error loading Pokémon:", error);
        }
    }
}

// Función para mostrar un mensaje de error
function showError(message) {
    appDiv.innerHTML = `<div class="error-message">${message}</div>`;
}

// Función para cargar una página de Pokémon
async function loadPokemonPage() {
    const url = `${apiBaseURL}?offset=${offset}&limit=${limit}`;
    const data = await fetchPokemon(url);
    if (data && data.results) {
        displayPokemon(data.results);
    }
}

// Función para buscar un Pokémon por nombre
async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    const url = `${apiBaseURL}/${query}`;
    try {
        const pokemonData = await fetchPokemon(url);
        if (pokemonData) {
            appDiv.innerHTML = ""; // Limpiar el contenedor
            const pokemonCard = document.createElement("div");
            pokemonCard.className = "pokemon-card";
            pokemonCard.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h3>${pokemonData.name}</h3>
                <button class="fav-btn" data-name="${pokemonData.name}">⭐</button>
            `;
            appDiv.appendChild(pokemonCard);

            // Listener para añadir/quitar favoritos
            const favBtn = pokemonCard.querySelector(".fav-btn");
            favBtn.addEventListener("click", () => toggleFavorite(pokemonData.name));
        }
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        showError("Pokémon no encontrado. Intenta con otro nombre.");
    }
}

// Función para alternar favoritos en LocalStorage
function toggleFavorite(pokemonName) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(pokemonName)) {
        favorites = favorites.filter(name => name !== pokemonName);
    } else {
        favorites.push(pokemonName);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Función para gestionar el botón "Previous"
function handlePrevious() {
    if (offset > 0) {
        offset -= limit;
        loadPokemonPage();
    }
}

// Función para gestionar el botón "Next"
function handleNext() {
    offset += limit;
    loadPokemonPage();
}

// Función para gestionar el botón "Reset"
function handleReset() {
    offset = 0;
    searchInput.value = "";
    loadPokemonPage();
}

// Event Listeners
searchBtn.addEventListener("click", searchPokemon);
prevBtn.addEventListener("click", handlePrevious);
nextBtn.addEventListener("click", handleNext);
resetBtn.addEventListener("click", handleReset);

// Cargar la primera página al iniciar
loadPokemonPage();
