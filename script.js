const baseTypeURL = 'https://pokeapi.co/api/v2/type/';
const urlParams = new URLSearchParams(window.location.search);
const selectedType = urlParams.get('type');

const pokedexContainer = document.getElementById('pokedex');
const searchForm = document.querySelector('#pokemon-search-form');
const typeDropdown = document.querySelector('.type-filter');
const resetButton = document.getElementById('reset-button');

let pokemonList = [];
let uniqueTypes = new Set();

const fetchAllPokemon = () => {
    const fetchPromises = Array.from({ length: 151 }, (_, index) => {
        const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${index + 1}`;
        return fetch(pokemonURL).then(response => response.json());
    });

    Promise.all(fetchPromises)
        .then(pokemonData => {
            pokemonList = pokemonData.map(pokemon => ({
                image: pokemon.sprites['front_default'],
                id: pokemon.id,
                name: pokemon.name,
                type: pokemon.types[0].type.name,
                abilities: pokemon.abilities.map(ability => ability.ability.name).join(', '),
                speciesUrl: pokemon.species.url
            }));
            displayPokemon(pokemonList);
        })
        .then(generateTypeOptions);
}

fetchAllPokemon();


searchForm.addEventListener('input', event => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.includes(searchTerm));
    updatePokedex(filteredPokemon);
});


typeDropdown.addEventListener('change', event => {
    const selectedType = event.target.value.toLowerCase();
    const filteredPokemon = selectedType
        ? pokemonList.filter(pokemon => pokemon.type === selectedType)
        : pokemonList;
    updatePokedex(filteredPokemon);
});


resetButton.addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    typeDropdown.value = '';
    updatePokedex(pokemonList);
});

function updatePokedex(pokemonArray) {
    pokedexContainer.innerHTML = '';
    displayPokemon(pokemonArray);
}

function displayPokemon(pokemonArray) {
    pokemonArray.forEach(pokemon => createPokemonCard(pokemon));
}

function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("flip-card");
    card.id = pokemon.name;

    const cardInner = document.createElement("div");
    cardInner.classList.add("flip-card-inner");
    cardInner.id = pokemon.type;


    const frontCard = document.createElement("div");
    frontCard.classList.add('front-pokemon-card');

    const frontImage = document.createElement('img');
    frontImage.src = pokemon.image;
    frontImage.classList.add("front-pokemon-image");

    const frontName = document.createElement('h2');
    frontName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.id}">${capitalize(pokemon.name)}</a>`;

    const frontID = document.createElement('p');
    frontID.textContent = `#${pokemon.id}`;
    frontID.classList.add("front-poke-id");

    const frontType = document.createElement('p');
    frontType.textContent = pokemon.type.toUpperCase();
    frontType.classList.add("front-pokemon-type");

    frontCard.append(frontImage, frontID, frontName, frontType);

    
    const backCard = document.createElement("div");
    backCard.classList.add('back-pokemon-card');

    const backName = document.createElement('h2');
    backName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.id}">${capitalize(pokemon.name)}</a>`;
    backName.classList.add("back-pokemon-name");

    const backAbilities = document.createElement("p");
    backAbilities.innerHTML = `<p>Abilities:<br>${pokemon.abilities}</p>`;
    backAbilities.classList.add("back-pokemon-abilities");

    backCard.append(backName, backAbilities);

    cardInner.append(frontCard, backCard);
    card.append(cardInner);
    pokedexContainer.append(card);

    uniqueTypes.add(pokemon.type);
}

function generateTypeOptions() {
    uniqueTypes.forEach(type => {
        const option = document.createElement('option');
        option.textContent = capitalize(type);
        option.value = type;
        typeDropdown.append(option);
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



