let defaultHp = 100;

export default class Pet {
  constructor(name, price) {
    this._hp = defaultHp;
    this._bought = false;
    this._name = name;
    this._price = price;
    this._feedprice = 20;
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }
  get feedprice() {
    return this._feedprice;
  }

  get hp() {
    return this._hp;
  }

  get bought() {
    return this._bought;
  }

  set bought(value) {
    this._bought = value;
  }

  changeHp(value) {
    this._hp += value;
    if (this._hp > 100) {
      this._hp = 100;
    }
    if (this._hp <= 0) {
      this._hp = 100;
      this._bought = false;
    }
  }
}
