import assert from "node:assert";
import test from "node:test";
import { Game } from "./Game.js";

const demo_game_1 = new Game();
demo_game_1._coins = 0;
test("origional coin", () => {
  assert.strictEqual(demo_game_1.coins, 0);
});

test("set coins to 100, then +50, -75", () => {
  demo_game_1._coins = 100;
  assert.strictEqual(demo_game_1.coins, 100);

  demo_game_1.changeCoins(50);
  assert.strictEqual(demo_game_1.coins, 150);

  demo_game_1.changeCoins(-75);
  assert.strictEqual(demo_game_1.coins, 75);

  demo_game_1._coins = 200;
  assert.strictEqual(demo_game_1.coins, 200);
});

const demo_game_2 = new Game();
demo_game_2._coins = 0;
demo_game_2.changeCoins(200);
test("game 2 has 200 coins", () => {
  assert.strictEqual(demo_game_2.coins, 200);
});
test("game 2 none pet is bought yet", () => {
  assert.strictEqual(demo_game_2._pets["piplup"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._feedprice, 20);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._name, "piplup");
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 100);
  assert.strictEqual(demo_game_2._pets["rattata"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["turtwig"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["squirtle"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["vulpix"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["snorlax"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["eevee"][0]._bought, 0);
});
test("game 2 buy pet piplup", () => {
  demo_game_2.buyPet("piplup");
  assert.strictEqual(demo_game_2._pets["piplup"][0]._bought, 1);
  assert.strictEqual(
    demo_game_2.coins,
    200 - demo_game_2._pets["piplup"][0]._price,
  );
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 100);
});
test("game 2 change hp", () => {
  demo_game_2.changeHp("piplup", -10);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 90);

  demo_game_2.changeHp("piplup", 20);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 100);
});
test("game 2 change hp piplup dies", () => {
  demo_game_2.changeHp("piplup", -90);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 10);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._bought, 1);

  demo_game_2.changeHp("piplup", -15);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._hp, 100);
  assert.strictEqual(demo_game_2._pets["piplup"][0]._bought, 0);
});

const demo_game_3 = new Game();
demo_game_3._coins = 0;
demo_game_3.changeCoins(300);
test("game 3 check changAllHp", () => {
  assert.strictEqual(demo_game_3.coins, 300);

  demo_game_3.buyPet("piplup");
  demo_game_3.buyPet("turtwig");
  demo_game_3.buyPet("eevee");
  assert.strictEqual(demo_game_3._pets["piplup"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["turtwig"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["eevee"][0]._bought, 1);
  const total_cost =
    demo_game_3._pets["piplup"][0]._price +
    demo_game_3._pets["turtwig"][0]._price +
    demo_game_3._pets["eevee"][0]._price;
  assert.strictEqual(demo_game_3.coins, 300 - total_cost);

  demo_game_3.changeHp("piplup", -20);
  demo_game_3.changeHp("turtwig", -50);
  assert.strictEqual(demo_game_3._pets["piplup"][0]._hp, 80);
  assert.strictEqual(demo_game_3._pets["turtwig"][0]._hp, 50);
  assert.strictEqual(demo_game_3._pets["eevee"][0]._hp, 100);

  demo_game_3.changeAllHp(-60);
  assert.strictEqual(demo_game_3._pets["piplup"][0]._hp, 20);
  assert.strictEqual(demo_game_3._pets["piplup"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["turtwig"][0]._bought, 0);
  assert.strictEqual(demo_game_3._pets["turtwig"][0]._hp, 100);
  assert.strictEqual(demo_game_3._pets["eevee"][0]._hp, 40);
  assert.strictEqual(demo_game_3._pets["snorlax"][0]._bought, 0);
  assert.strictEqual(demo_game_3._pets["snorlax"][0]._hp, 100);
});

const demo_game_4 = new Game();
const demo_game_4_temp = new Game();
demo_game_4._coins = 0;
demo_game_4.changeCoins(400);
demo_game_4_temp._coins = demo_game_4._coins;
test("game 4 check serialization & deserialization 1", () => {
  assert.strictEqual(demo_game_4.coins, 400);
  const serialized_game_4 = demo_game_4.serializePets();
  // const deserialized_game_4 = demo_game_4.deserializePets(serialized_game_4);
  demo_game_4_temp.pets = demo_game_4_temp.deserializePets(serialized_game_4);
  assert.deepStrictEqual(demo_game_4, demo_game_4_temp);
});
test("game 4 check serialization & deserialization 2", () => {
  const serialized_game_4 = demo_game_4.serializePets();

  demo_game_4.buyPet("piplup");
  demo_game_4.buyPet("eevee");
  demo_game_4.changeHp("piplup", -10);
  demo_game_4.changeHp("eevee", -25);

  // const deserialized_game_4 = demo_game_4.deserializePets(serialized_game_4);
  demo_game_4_temp.pets = demo_game_4_temp.deserializePets(serialized_game_4);
  assert.notDeepStrictEqual(demo_game_4, demo_game_4_temp);

  demo_game_4_temp.buyPet("piplup");
  demo_game_4_temp.buyPet("eevee");
  demo_game_4_temp.changeHp("piplup", -10);
  demo_game_4_temp.changeHp("eevee", -25);
  assert.deepStrictEqual(demo_game_4, demo_game_4_temp);
});
