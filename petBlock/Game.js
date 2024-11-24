const Pet = require('./Pet')

class Game {
  constructor() {
    // if localStorage.getItem('game') !== null {
    //   this.game = localStorage.getItem('game');
    // }
    // For script
    this._coins = 0;
    this._pets = {
      Dog: new Pet('Dog', 10),
      Cat: new Pet('Cat', 20),
      Horse: new Pet('Horse', 50),
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
      this._pets[name].bought = true;
      this._coins -= this._pets[name].price; // assume enough coins
    }
  }

  changeHp(name, hp) {
    if (name in this._pets) {
      this._pets[name].changeHp(hp);
    }
  }

  changeAllHp(hp) {
    for (const key in this._pets) {
      this._pets[key].changeHp(hp);
    }
  }
}

module.exports = Game