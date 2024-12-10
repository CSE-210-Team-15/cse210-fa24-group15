import Pet from "./Pet.js";

export default class Game {
  constructor() {
    this._coins = 100;
    this._pets = {};
    const petNames = [
      "piplup",
      "rattata",
      "turtwig",
      "squirtle",
      "vulpix",
      "snorlax",
      "eevee",
    ];
    const petPrices = [11, 30, 35, 70, 90, 80, 100];

    for (let i = 0; i < 7; i++) {
      const name = petNames[i];
      const price = petPrices[i];
      this._pets[name] = [
        new Pet(name, price),
        "src/components/pets/assets/" + name + ".png",
      ];
    }
  }

  get coins() {
    return this._coins;
  }

  set coins(value) {
    this._coins = value;
  }

  changeCoins(value) {
    this._coins += value;
  }

  get pets() {
    return this._pets;
  }

  set pets(value) {
    this._pets = value;
  }

  buyPet(name) {
    if (name in this._pets) {
      this._pets[name][0].bought = 1;
      this._coins -= this._pets[name][0].price;
    }
  }

  changeHp(name, hp) {
    if (name in this._pets) {
      this._pets[name][0].changeHp(hp);
    }
  }

  changeAllHp(hp) {
    for (const key in this._pets) {
      if (this._pets[key][0].bought) {
        this._pets[key][0].changeHp(hp);
      }
    }
  }
  serializePets() {
    const serializedPets = {};
    Object.entries(this.pets).forEach(([name, petData]) => {
      const pet = petData[0]; // Access the Pet instance
      const imageUrl = petData[1]; // Access the pet image URL
      serializedPets[name] = {
        name: pet.name,
        price: pet.price,
        feedprice: pet.feedprice,
        hp: pet.hp,
        bought: pet.bought,
        imageUrl: imageUrl,
        timestamp: pet.timestamp,
      };
    });
    return serializedPets;
  }

  deserializePets(serializedPets) {
    const pets = {};
    Object.entries(serializedPets).forEach(([name, petData]) => {
      const pet = new Pet(
        petData.name,
        petData.price,
        petData.feedprice,
        petData.hp,
        petData.bought,
        petData.timestamp,
      );
      pets[name] = [pet, petData.imageUrl];
    });
    return pets;
  }
}

export { Game };
