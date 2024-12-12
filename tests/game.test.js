import assert from "node:assert";
import test from "node:test";
import { Game } from "../src/components/petBlock/Game.js";

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
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._feedprice, 20);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._name, "Piplup");
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 100);
  assert.strictEqual(demo_game_2._pets["Rattata"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Turtwig"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Squirtle"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Vulpix"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Snorlax"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Eevee"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Dragonite"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Jigglypuff"][0]._bought, 0);
  assert.strictEqual(demo_game_2._pets["Wooper"][0]._bought, 0);
});
test("game 2 buy pet Piplup", () => {
  demo_game_2.buyPet("Piplup");
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._bought, 1);
  assert.strictEqual(
    demo_game_2.coins,
    200 - demo_game_2._pets["Piplup"][0]._price,
  );
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 100);
});
test("game 2 change hp", () => {
  demo_game_2.changeHp("Piplup", -10);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 90);

  demo_game_2.changeHp("Piplup", 20);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 100);
});
test("game 2 change hp Piplup dies", () => {
  demo_game_2.changeHp("Piplup", -90);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 10);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._bought, 1);

  demo_game_2.changeHp("Piplup", -15);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._hp, 100);
  assert.strictEqual(demo_game_2._pets["Piplup"][0]._bought, 0);
});

const demo_game_3 = new Game();
demo_game_3._coins = 0;
demo_game_3.changeCoins(300);
test("game 3 check changAllHp", () => {
  assert.strictEqual(demo_game_3.coins, 300);

  demo_game_3.buyPet("Piplup");
  demo_game_3.buyPet("Turtwig");
  demo_game_3.buyPet("Eevee");
  assert.strictEqual(demo_game_3._pets["Piplup"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["Turtwig"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["Eevee"][0]._bought, 1);
  const total_cost =
    demo_game_3._pets["Piplup"][0]._price +
    demo_game_3._pets["Turtwig"][0]._price +
    demo_game_3._pets["Eevee"][0]._price;
  assert.strictEqual(demo_game_3.coins, 300 - total_cost);

  demo_game_3.changeHp("Piplup", -20);
  demo_game_3.changeHp("Turtwig", -50);
  assert.strictEqual(demo_game_3._pets["Piplup"][0]._hp, 80);
  assert.strictEqual(demo_game_3._pets["Turtwig"][0]._hp, 50);
  assert.strictEqual(demo_game_3._pets["Eevee"][0]._hp, 100);

  demo_game_3.changeAllHp(-60);
  assert.strictEqual(demo_game_3._pets["Piplup"][0]._hp, 20);
  assert.strictEqual(demo_game_3._pets["Piplup"][0]._bought, 1);
  assert.strictEqual(demo_game_3._pets["Turtwig"][0]._bought, 0);
  assert.strictEqual(demo_game_3._pets["Turtwig"][0]._hp, 100);
  assert.strictEqual(demo_game_3._pets["Eevee"][0]._hp, 40);
  assert.strictEqual(demo_game_3._pets["Snorlax"][0]._bought, 0);
  assert.strictEqual(demo_game_3._pets["Snorlax"][0]._hp, 100);
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

  demo_game_4.buyPet("Piplup");
  demo_game_4.buyPet("Eevee");
  demo_game_4.changeHp("Piplup", -10);
  demo_game_4.changeHp("Eevee", -25);

  demo_game_4_temp.pets = demo_game_4_temp.deserializePets(serialized_game_4);
  assert.notDeepStrictEqual(demo_game_4, demo_game_4_temp);

  demo_game_4_temp.buyPet("Piplup");
  demo_game_4_temp.buyPet("Eevee");
  demo_game_4_temp.changeHp("Piplup", -10);
  demo_game_4_temp.changeHp("Eevee", -25);
  assert.deepStrictEqual(demo_game_4, demo_game_4_temp);
});
