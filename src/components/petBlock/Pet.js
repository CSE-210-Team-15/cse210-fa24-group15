/**
 * @fileoverview Provides the functions required by the Pet class
 * 
 */
let defaultHp = 100;

export default class Pet {
  constructor(
    name,
    price,
    feedprice = 20,
    hp = defaultHp,
    bought = 0,
    timestamp = Date.now()
  ) {
    this._hp = hp;
    this._bought = bought;
    this._name = name;
    this._price = price;
    this._feedprice = feedprice;
    this._timestamp = timestamp;
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

  set hp(value) {
    this._hp = value;
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
      this._bought = 0;
      return false;
    }
    return true;
  }

  get timestamp() {
    return this._timestamp;
  }

  set timestamp(value) {
    this._timestamp = value;
  }
}
