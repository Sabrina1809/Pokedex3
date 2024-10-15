let evo1PokemonImg = document.getElementById("evo1PokemonImg");
let evo2PokemonImg = document.getElementById("evo2PokemonImg");
let evo3PokemonImg = document.getElementById("evo3PokemonImg");
let evo1PokemonName = document.getElementById("evo1PokemonName");
let evo2PokemonName = document.getElementById("evo2PokemonName");
let evo3PokemonName = document.getElementById("evo3PokemonName");

async function setInfoEvo(pokemonArrayToShow, indexOfPokemonArrayToShow) {
    let thisPokemon = pokemonArrayToShow[indexOfPokemonArrayToShow];
    console.log('thisPokemon', thisPokemon)
    let thisPokemonName = thisPokemon.name;
    console.log('thisName: ', thisPokemonName)
    let evolvesFrom = thisPokemon.evolves_from?.name || null
    console.log('evolves_from:', evolvesFrom)

    let firstNameInChain = thisPokemon.chain.species?.name || null;
    let firstIndexInArrayToShow = await checkIndexOfPokemon(firstNameInChain)
    console.log("1. ", firstIndexInArrayToShow," ", firstNameInChain);
    
    let secondNameInChain = thisPokemon.chain.evolves_to.length > 0 
        ? thisPokemon.chain.evolves_to[0].species?.name 
        : null;
    let secondIndexInArrayToShow = await checkIndexOfPokemon(secondNameInChain)
    console.log("2. ", secondIndexInArrayToShow," ", secondNameInChain);
 
    let thirdNameInChain = checkThirdNameInChain(secondNameInChain, thisPokemon)
    let thirdIndexInArrayToShow = await checkIndexOfPokemon(thirdNameInChain)
    console.log("3. ", thirdIndexInArrayToShow," ", thirdNameInChain);

    setEvoChain("evo1pokemon", evo1PokemonImg, evo1PokemonName, firstIndexInArrayToShow, firstNameInChain)
    setEvoChain("evo2pokemon", evo2PokemonImg, evo2PokemonName, secondIndexInArrayToShow, secondNameInChain)
    setEvoChain("evo3pokemon", evo3PokemonImg, evo3PokemonName, thirdIndexInArrayToShow, thirdNameInChain)
    setGrayScale(evo1PokemonName, evo2PokemonName, evo3PokemonName, thisPokemonName)    
}

function checkThirdNameInChain(secondNameInChain, thisPokemon) {    
    let thirdName;
    if (secondNameInChain == null) {
        thirdName = null;
    } else {
        thirdName = 
        thisPokemon.chain.evolves_to[0].evolves_to.length > 0
        ? thisPokemon.chain.evolves_to[0].evolves_to[0].species?.name
        : null;
    }
    return thirdName
}

async function checkIndexOfPokemon(nameToFind) {
    let index = pokemonArrayToShow.findIndex(pokemon => pokemon.name === nameToFind);
    if (index !== -1) {
       return index
      } else {
        let newIndex = await checkIndexOfPokemonInAllNames(nameToFind)
        return newIndex
      }
}

async function checkIndexOfPokemonInAllNames(nameToFind) {
    let index;
    if (nameToFind == null) {
        index = null;
    } else {
        let indexAllPokemon = allPokemonNames.results.findIndex(pokemon => pokemon.name === nameToFind);
        // console.log(indexAllPokemon)
        let responseDetails = await fetch(allPokemonNames.results[indexAllPokemon].url);
        let pokemonDetails = await responseDetails.json();
        // console.log('pokemonDetails', pokemonDetails);
        let responseMoreDetails = await fetch(pokemonDetails.species.url);
        let pokemonMoreDetails = await responseMoreDetails.json();
        // console.log('pokemonMoreDetails', pokemonMoreDetails);
        let responsePokemonEvoChain = await fetch(pokemonMoreDetails.evolution_chain.url);
        let pokemonEvoChain = await responsePokemonEvoChain.json();
        // console.log('evochain', pokemonEvoChain)
        connectDetails(pokemonDetails, pokemonMoreDetails, pokemonEvoChain)
        index = checkIndexOfPokemon(nameToFind)
    }
    return index
}

function connectDetails(pokemonDetails, pokemonMoreDetails, pokemonEvoChain) {
    let singlePokemon = Object.assign(
        {}, 
        {"abilities" : pokemonDetails.abilities}, 
        {"height" : pokemonDetails.height}, 
        {"weight" : pokemonDetails.weight}, 
        {"id" : pokemonDetails.id}, 
        {"is_default" : pokemonDetails.is_default}, 
        {"base_experience" : pokemonDetails.base_experience}, 
        {"name" : pokemonDetails.name}, 
        {"order" : pokemonDetails.order}, 
        {"species" : pokemonDetails.species}, 
        {"img" : pokemonDetails.sprites.other.home.front_default}, 
        {"stats" : pokemonDetails.stats}, 
        {"types" : pokemonDetails.types}, 
        {"evolves_from" : pokemonMoreDetails.evolves_from_species}, 
        {"chain" : pokemonEvoChain.chain}, 
    )
    pokemonArrayToShow.push(singlePokemon);
    pokemonArrayToShow.sort((a, b) => a.id - b.id);
}

function setEvoChain(evoCtn, evoImg, evoName, indexInArrayToShow, name) {
    if (indexInArrayToShow === null || indexInArrayToShow === -1 || name === null) {
        document.getElementById(evoCtn).style.display = "none";
    } else {
        document.getElementById(evoCtn).style.display = "flex";
        evoImg.src = pokemonArrayToShow[indexInArrayToShow].img;
        evoName.innerHTML = name;
    }
}

function setGrayScale(evo1Name, evo2Name, evo3Name, thisName) {
    document.getElementById("evo1PokemonImg").style.filter = "grayscale(100%)";
    document.getElementById("evo2PokemonImg").style.filter = "grayscale(100%)";
    document.getElementById("evo3PokemonImg").style.filter = "grayscale(100%)";
    if (evo1Name.innerHTML == thisName) {
        // console.log(evo1Name.innerHTML, thisName);
        document.getElementById("evo1PokemonImg").style.filter = "grayscale(0%)";
    } else if (evo2Name.innerHTML == thisName) {
        // console.log(evo2Name.innerHTML, thisName);
        document.getElementById("evo2PokemonImg").style.filter = "grayscale(0%)";
    } else if (evo3Name.innerHTML == thisName) {
        // console.log(evo3Name.innerHTML, thisName);
        document.getElementById("evo3PokemonImg").style.filter = "grayscale(0%)";
    }
}

async function openEvoPokemon(e) {
    // console.log(e)
    let evoNameToOpen = e.srcElement.nextElementSibling.innerHTML;
    // console.log(evoNameToOpen);
    let evoIndexToOpen = await checkIndexOfPokemon(evoNameToOpen)
    // console.log(evoIndexToOpen);
    addClassNamesButtons(evoIndexToOpen);
    let nextIndex = evoIndexToOpen;
    fillOverlay(nextIndex) 
    document.getElementById("card_overlay").addEventListener("click", function(e) {
        e.stopPropagation()
    })
}