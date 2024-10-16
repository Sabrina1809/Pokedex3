let filteredPokemonDetails = [];
let filteredPokemonMoreDetails = [];
let filteredPokemonNames = [];

function getFilter() {
    let filter = inputField.value.toLowerCase();
    if (filter.length >= 2) {
        startLoadingSpinner()
        setPlaceholder('gray')
        checkNamesArray(filter)
        clearArraysAndData()
    } else {
        setPlaceholder('red');
    }
}

function clearArraysAndData() {
    document.getElementById("cards_area").innerHTML = "";
    filteredPokemonDetails = [];
    filteredPokemonMoreDetails = [];
    filteredPokemonAllDetails = [];
    filteredPokemonNames = []
    window.scrollTo({top: 0});
    document.getElementById("show_more").className = "0";
}

function setPlaceholder(color) {
    inputField.value = "";
    inputField.setAttribute("placeholder", "mind. 2 Zeichen");
    inputField.style.setProperty('--placeholder-color', color);
}

function checkNamesArray(filter) {
    for (let i = 0; i < allPokemonNames.results.length; i++) {
        if (allPokemonNames.results[i].name.includes(filter)) {
            filteredPokemonNames.push(allPokemonNames.results[i])
        }
    }
    loadFilteredPokemon()
}

async function loadFilteredPokemon() {
    let promisesSinglePokemon = filteredPokemonNames.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    filteredPokemonDetails = await Promise.all(promisesSinglePokemon); 
    let promisesallPokemonMoreDetails = filteredPokemonDetails.map(pokemon => fetch(pokemon.species.url).then(res => res.json()));
    filteredPokemonMoreDetails = await Promise.all(promisesallPokemonMoreDetails); 
    filteredPokemonAllDetails = await connectArrays(filteredPokemonDetails, filteredPokemonMoreDetails, filteredPokemonAllDetails);
    pokemonArrayToShow = filteredPokemonAllDetails;
    renderNextTwentyPokemon(pokemonArrayToShow)
}