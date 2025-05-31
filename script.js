const container = document.getElementById('pokemonContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortButton = document.getElementById('sortButton');

let allPokemons = [];

async function getPokemonData(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await response.json();
}

function createCard(pokemon) {
  const card = document.createElement('div');
  const types = pokemon.types.map(t => t.type.name).join(', ');
  card.className = 'pokemon-card';
  card.setAttribute('data-name', pokemon.name.toLowerCase());
  card.setAttribute('data-types', types.toLowerCase());

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
    <h2 class="pokemon-name">${pokemon.name}</h2>
    <p><strong>Type:</strong> ${types}</p>
    <p><strong>Height:</strong> ${pokemon.height}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
  `;

  container.appendChild(card);
}

function renderCards(pokemonList) {
  container.innerHTML = '';
  pokemonList.forEach(pokemon => createCard(pokemon));
}

async function generatePokemonCards(count = 150) {
  for (let i = 1; i <= count; i++) {
    const pokemon = await getPokemonData(i);
    allPokemons.push(pokemon);
  }
  renderCards(allPokemons);
}

function searchPokemon() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.pokemon-card');

  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    if (!searchValue || name.includes(searchValue)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function sortPokemonAlphabetically() {
  allPokemons.sort((a, b) => a.name.localeCompare(b.name));
  renderCards(allPokemons);
}

searchButton.addEventListener('click', searchPokemon);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchPokemon();
});
sortButton.addEventListener('click', sortPokemonAlphabetically);

generatePokemonCards();

const style = document.createElement('style');
style.textContent = `
  .pokemon-card {
    width: 250px;
    height: 380px;
    background-color: yellow;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    padding: 16px;
    text-align: center;
    font-family: sans-serif;
    margin: 12px;
    display:flex;
    gap:10px;
    flex-direction:column;
  }
  .pokemon-image {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin: 0 auto 12px;
  }
  .pokemon-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    text-transform: capitalize;
  }
  #pokemonContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hidden {
    display: none !important;
  }
`;
document.head.appendChild(style);


const typeFilter = document.getElementById('typeFilter');

typeFilter.addEventListener('change', () => {
  const selectedType = typeFilter.value;

  const cards = document.querySelectorAll('.pokemon-card');
  cards.forEach(card => {
    const types = card.getAttribute('data-types');
    if (!selectedType || types.includes(selectedType)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
});
