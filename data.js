async function getPokemonData() {
  const totalPokemons = 150;
  const limit = 10;
  const apiEndpoint = 'https://pokeapi.co/api/v2/pokemon';

  const allPokemons = [];

  async function getPokemons(offset) {
    const response = await fetch(`${apiEndpoint}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    const pokemons = data.results;

    for (let i = 0; i < pokemons.length; i++) {
      const pokemonResponse = await fetch(pokemons[i].url);
      const pokemonData = await pokemonResponse.json();

      const pokemon = {
        name: pokemonData.name,
        id: pokemonData.id,
        image: pokemonData.sprites.front_default,
        types: pokemonData.types.map(type => type.type.name),
      };

      allPokemons.push(pokemon);
    }
  }

  for (let offset = 0; offset < totalPokemons; offset += limit) {
    await getPokemons(offset);
  }

  return allPokemons;
}

function showPokemonData(pokemons) {
  const container = document.querySelector('.container');
  container.innerHTML = "";
  let emptyContainer = '';
  pokemons.forEach((element) => {
    emptyContainer +=
      `<div class="card">
         <img src="${element.image}" class="img">
         <div class="titulos">
            <h2>${element.name}</h2>
            <h4>Type: ${element.types.join(", ")}</h4>
            <button class="add-to-favs" data-pokemon='${JSON.stringify(element)}'>
               add to favs
            </button>
         </div>
      </div>`;
  });
  container.innerHTML = emptyContainer;

  // add event listener to "add to favs" button
  const addToFavsButtons = document.querySelectorAll('.add-to-favs');
  addToFavsButtons.forEach((button) => {
    const pokemon = JSON.parse(button.dataset.pokemon);
    button.addEventListener('click', () => {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.findIndex(p => p.id === pokemon.id);
      if (index === -1) {
        favorites.push(pokemon);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.innerText = 'remove from favs';
      } else {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.innerText = 'add to favs';
      }
    });

    // set button text based on whether the pokemon is already in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(p => p.id === pokemon.id);
    if (index !== -1) {
      button.innerText = 'remove from favs';
    }
  });
}


function filterPokemon(pokemons, searchValue) {
  return pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue.toLowerCase()));
}

async function initialize() {
  const pokemons = await getPokemonData();
  showPokemonData(pokemons);

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim();
    const filteredPokemons = filterPokemon(pokemons, searchValue);
    showPokemonData(filteredPokemons);
  });

  const favoritesButton = document.getElementById('favorites-button');
  favoritesButton.addEventListener('click', () => {
    const favoritePokemons = getFavoritePokemon();
    showFavoritePokemon(favoritePokemons);
  });
}

initialize();

