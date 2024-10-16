

















let filteredPokemonDetails = [];
let filteredPokemonMoreDetails = [];
let filteredPokemonNames = [];

function getFilter() {
    let filter = inputField.value.toLowerCase();
    console.log(filter)
    if (filter.length >= 1) {
        startLoadingSpinner()
        setPlaceholder('gray')
        checkNamesArray(filter)
        document.getElementById("cards_area").innerHTML = "";
        filteredPokemonDetails = [];
        filteredPokemonMoreDetails = [];
        filteredPokemonAllDetails = [];
        filteredPokemonNames = []
        window.scrollTo({top: 0});
        document.getElementById("show_more").className = "0";
    } else {
        setPlaceholder('red');
    }
}

function setPlaceholder(color) {
    inputField.value = "";
    inputField.setAttribute("placeholder", "mind. 1 Buchstabe");
    inputField.style.setProperty('--placeholder-color', color);
}

function checkNamesArray(filter) {
    for (let i = 0; i < allPokemonNames.results.length; i++) {
        if (allPokemonNames.results[i].name.includes(filter)) {
            filteredPokemonNames.push(allPokemonNames.results[i])
        }
    }
    // console.log('filterdPokemonNames', filteredPokemonNames)

    loadFilteredPokemon()
}

async function loadFilteredPokemon() {
    let promisesSinglePokemon = filteredPokemonNames.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    filteredPokemonDetails = await Promise.all(promisesSinglePokemon); 
    // console.log('filteredPokemonDetails', filteredPokemonDetails)
    let promisesallPokemonMoreDetails = filteredPokemonDetails.map(pokemon => fetch(pokemon.species.url).then(res => res.json()));
    filteredPokemonMoreDetails = await Promise.all(promisesallPokemonMoreDetails); 
    // console.log('filteredPokemonMoreDetails', filteredPokemonMoreDetails);
    filteredPokemonAllDetails = await connectArrays(filteredPokemonDetails, filteredPokemonMoreDetails, filteredPokemonAllDetails)
    // console.log('filteredPokemonAllDetails', filteredPokemonAllDetails)
    pokemonArrayToShow = filteredPokemonAllDetails;
    renderNext20Pokemon(pokemonArrayToShow)
}