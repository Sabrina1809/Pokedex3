let baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=';
let offset = 0;
let unfilteredPokemonDetails = [];
let unfilteredPokemonMoreDetails = [];
let unfilteredPokemonNames = [];

async function load50UnfilteredPokemon() {
    let response = await fetch(baseURL + `${offset}`);
    let dataAllPokemon = await response.json();
    let namesAndURL = dataAllPokemon.results;
    let promisesSinglePokemon = namesAndURL.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    unfilteredPokemonDetails = await Promise.all(promisesSinglePokemon); 
    let promisesUnfilteredPokemonMoreDetails = unfilteredPokemonDetails.map(pokemon => fetch(pokemon.species.url).then(res => res.json()));
    unfilteredPokemonMoreDetails = await Promise.all(promisesUnfilteredPokemonMoreDetails); 
    unfilteredPokemonAllDetails = await connectArrays(unfilteredPokemonDetails, unfilteredPokemonMoreDetails, unfilteredPokemonAllDetails)
    offset = offset + 50 
    renderNext20Pokemon(pokemonArrayToShow)
}