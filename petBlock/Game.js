import Pet from './Pet.js';

export default class Game {
  constructor() {
    this._coins = 100;
    this._pets = {
    };
  }

  get coins() {
    return this._coins;
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
      this._pets[name][0].bought = true;
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
}
