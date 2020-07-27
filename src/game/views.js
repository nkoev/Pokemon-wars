import { pokemonsContainer } from "./common.js";
import { getPokemons } from "./data-service.js";
import { startBattle } from "./events.js";
let pokemonsList;

const listPokemon = (pokemon) => {
  const card = document.createElement("div");
  card.setAttribute("id", pokemon.name);
  card.setAttribute("class", "card");

  const sprite = document.createElement("img");
  sprite.setAttribute("src", pokemon.frontSprite);
  sprite.setAttribute("id", pokemon.id);
  sprite.setAttribute("class", "avatar");

  const info = document.createElement("ul");
  info.innerHTML = `<li>Name: ${pokemon.name}</li>
  <li>Ability: ${pokemon.ability}</li>
  <li>Move 1: ${pokemon.moves[0]}</li>
  <li>Move 2: ${pokemon.moves[1]}</li>
  <li>Move 3: ${pokemon.moves[2]}</li>
  <li>Move 4: ${pokemon.moves[3]}</li>
  <li>Speed: ${pokemon.speed}</li>
  <li>Special Defense: ${pokemon.specialDefense}</li>
  <li>Special Attack: ${pokemon.specialAttack}</li>
  <li>Defense: ${pokemon.defense}</li>
  <li>Attack: ${pokemon.attack}</li>
  <li>HP: ${pokemon.hp}</li>`;

  card.appendChild(sprite);
  card.appendChild(info);
  pokemonsContainer.appendChild(card);
};

const selectOponent = (heroId) => {
  const remainingPokemons = pokemonsList.filter(({ id }) => id !== heroId);

  return remainingPokemons[
    Math.floor(Math.random() * remainingPokemons.length)
  ];
};

const loadImage = (url) => {
  return new Promise((fulfill, reject) => {
    let imageObj = new Image();
    imageObj.onload = () => fulfill(imageObj);
    imageObj.src = url;
  });
};

const runBattle = (hero, oponent, next) => {
  if (next === oponent) {
    const damage = (oponent.attack / hero.defense) * Math.random() * 200;
    if (damage > 0) {
      hero.currentHP -= damage;
      return next;
    }
  } else {
    const damage = (hero.attack / oponent.defense) * Math.random() * 200;
    if (damage > 0) {
      oponent.currentHP -= damage;
      return next;
    }
  }
};

export const displayBattle = (heroId) => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "battle");
  const ctx = canvas.getContext("2d");

  const hero = pokemonsList[heroId];
  let heroSprite;
  let x1 = 10;
  let y1 = 50;
  const oponent = selectOponent(heroId);
  let oponentSprite;
  let x2 = 180;
  let y2 = 50;
  Promise.all([
    loadImage(hero.backSprite),
    loadImage(oponent.frontSprite),
  ]).then((images) => {
    heroSprite = images[0];
    oponentSprite = images[1];
    startFight();
  });

  let next = hero.speed > oponent.speed ? hero : oponent;

  const startFight = () => {
    if (hero.currentHP < 0 || oponent.currentHP < 0) {
      return;
    }
    if (next === oponent) {
      console.log("oponent attack");
      const damage = (oponent.attack / hero.defense) * Math.random() * 200;
      if (damage > 0) {
        hero.currentHP -= damage;
        console.log(hero.currentHP);
        next = hero;
        oponentAttack();
      } else {
        next = hero;
        startFight();
      }
    } else {
      console.log("hero attack");
      const damage = (hero.attack / oponent.defense) * Math.random() * 200;
      if (damage > 0) {
        oponent.currentHP -= damage;
        console.log(oponent.currentHP);
        heroAttack();
      } else {
        next = hero;
        startFight();
      }
    }
  };

  const heroAttack = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(heroSprite, x1, y1);
    ctx.drawImage(oponentSprite, x2, y2);
    x1 += 5;
    if (x1 < 100) {
      requestAnimationFrame(heroAttack);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(heroSprite, 10, 50);
      ctx.drawImage(oponentSprite, 180, 50);
      startFight();
    }
  };

  const oponentAttack = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(heroSprite, x1, y1);
    ctx.drawImage(oponentSprite, x2, y2);
    x2 -= 5;
    if (x2 > 90) {
      requestAnimationFrame(oponentAttack);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(heroSprite, 10, 50);
      ctx.drawImage(oponentSprite, 180, 50);
      startFight();
    }
  };
  pokemonsContainer.appendChild(canvas);
};

export const displayPokemons = async () => {
  pokemonsList = await getPokemons();
  pokemonsList.forEach(listPokemon);
};
