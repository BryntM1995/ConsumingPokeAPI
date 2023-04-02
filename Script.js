const MAIN_URL_POKEMONS = "https://pokeapi.co/api/v2/pokemon/";
let pokeList = document.querySelector("#list-PokeResults");
let allPokemon = [];
//pokemon lists
let ulpoke_Status = document.querySelector("#poke-Status");
let ul_poke_abilities = document.querySelector("#poke-Abilites");
let ul_poke_Moves = document.querySelector("#poke-Moves");
//pokemon details
let main_PokePic = document.querySelector("#mainBigPic");
let main_pokeName = document.querySelector("#name");
let main_pokeType = document.querySelector("#type");
let main_pokeHeight = document.querySelector("#poke_height");
let main_pokeWeight = document.querySelector("#poke_wight");
let main_pokeExperience = document.querySelector("#poke_experience");
//others
let select = document.querySelector("#typeSelector");
console.log(select.value);
function showAllPokemons() {
  fetch(`${MAIN_URL_POKEMONS}?offset=20&limit=500`)
    .then((response) => response.json())
    .then(function (data) {
      allPokemon = data.results;
      data.results.forEach((pokemon) => {
        toMakePokemonList(pokemon);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function toMakePokemonList(pokemon) {
  fetch(pokemon.url)
    .then((res) => res.json())
    .then(function (info) {
      if (toFilterListByType(info)) {
        let pokePic = document.createElement("img");
        let pokeName = document.createElement("span");
        let poketype = document.createElement("span");
        let row = document.createElement("div");

        //setting classes and id
        pokePic.className = "poke-Pics";
        pokeName.className = "poke-Names";
        poketype.className = "poke-types";
        row.className = "poke-row";

        //set values and attributtes
        let poke_Pic = info.sprites.other.dream_world.front_default;
        pokeName.textContent = `Name: ${pokemon.name}`;
        let poke_type = showTypesInRow(info);
        pokePic.setAttribute("src", poke_Pic);
        poketype.textContent = poke_type;

        // building rows
        row.appendChild(pokePic);
        row.appendChild(pokeName);
        row.appendChild(poketype);
        pokeList.appendChild(row);
        //events
        row.onclick = function () {
          showPokemonAbilities(info);
          showPokemonStats(info);
          showPokemonMoves(info);
          showPokemontypes(info);
          main_PokePic.setAttribute("src", poke_Pic);
          main_pokeName.textContent = `Name: ${pokemon.name}.`;
          main_pokeHeight.textContent = `Height: ${info.height} Ft.`;
          main_pokeWeight.textContent = `Weight: ${info.weight} Kg.`;
          main_pokeExperience.textContent = `Experience: ${info.base_experience} Exp.`;
        };
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
select.addEventListener("change", () => {
  pokeList.innerHTML = "";
  showAllPokemons();
});

function showPokemonAbilities(info) {
  ul_poke_abilities.innerHTML = "";
  info.abilities.forEach((action) => {
    let li_ability = document.createElement("li");
    li_ability.textContent = action.ability.name;
    ul_poke_abilities.appendChild(li_ability);
  });
}
function showPokemonMoves(info) {
  ul_poke_Moves.innerHTML = "";
  info.moves.forEach((element) => {
    let li_move = document.createElement("li");
    li_move.textContent = element.move.name;
    ul_poke_Moves.appendChild(li_move);
  });
}

function showPokemonStats(info) {
  ulpoke_Status.innerHTML = "";
  info.stats.forEach((element) => {
    let li_stat = document.createElement("li");
    li_stat.textContent = `${element.stat.name}: ${element.base_stat}`;
    li_stat.types = "disc";
    ulpoke_Status.appendChild(li_stat);
  });
}
function showPokemontypes(info) {
  main_pokeType.innerHTML = "";
  info.types.forEach((element) => {
    let span_type = document.createElement("span");
    span_type.textContent = `Type: ${element.type.name}. `;
    main_pokeType.appendChild(span_type);
  });
}
function showTypesInRow(info){
    let poke_type;
    let result="";
    info.types.forEach((element)=>{
        poke_type=`${element.type.name}/ `;
        result+=poke_type;
    });
    return "Type: "+result;
}
//debes cambiar el arreglo recibido por uno filtrado por el tipo
const toFilterList = (event) => {
  const value = event.target.value;
  const filteredData = allPokemon.filter((x) =>
    x.name.toLocaleLowerCase().trim().includes(value.toLocaleLowerCase().trim())
  );
  filteredData.forEach((pokemon) => {
    toMakePokemonList(pokemon);
  });
  pokeList.innerHTML = "";
};
function toFilterListByType(info) {
  let filteredType = [];
  for (let index = 0; index < info.types.length; index++) {
    if (
      info.types[index].type.name === select.value.toLocaleLowerCase().trim() ||
      select.value === "Todos"
    ) {
      filteredType.push(info.types[index].type.name);
    }
  }
  return toValidateFilteredType(filteredType);
}
function toValidateFilteredType(filteredType) {
  return filteredType.includes(select.value.toLocaleLowerCase().trim()) || select.value.includes("Todos");
}
const onWindowsLoad = () => {
  document.querySelector("#searchBar").addEventListener("keyup", toFilterList);
  showAllPokemons();
};
window.onload = onWindowsLoad;
