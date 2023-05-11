function showFavoritePokemon(favorites) {
    const container = document.querySelector('.container');
    container.innerHTML = "";
    let emptyContainer = '';
    favorites.forEach((element) => {
      emptyContainer +=
        `<div class="card">
           <img src="${element.image}" class="img">
           <div class="titulos">
              <h2>${element.name}</h2>
              <h4>Type: ${element.types.join(", ")}</h4>
              <button class="remove-from-favs" data-pokemon='${JSON.stringify(element)}'>
                 remove from favs
              </button>
           </div>
        </div>`;
    });
    container.innerHTML = emptyContainer;
  

    const removeFromFavsButtons = document.querySelectorAll('.remove-from-favs');
    removeFromFavsButtons.forEach((button) => {
      const pokemon = JSON.parse(button.dataset.pokemon);
      button.addEventListener('click', () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favorites.findIndex(p => p.id === pokemon.id);
        if (index !== -1) {
          favorites.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          showFavoritePokemon(favorites);
        }
      });
    });
  }
  
  function getFavoritePokemon() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    showFavoritePokemon(favorites);
  }
  
  getFavoritePokemon();
  