import assert from 'node:assert';
import test from 'node:test';
import {Game} from './Game.js';
// //
// // const demo_game_1 = new Game();
// // const demo_game_2 = new Game();
// // const demo_game_3 = new Game();
// // const demo_game_4 = new Game();
// // const demo_game_5 = new Game();
//
//
//
const demo_game_1 = new Game()
demo_game_1._coins = 0

test('origional coin', () => {
    assert.strictEqual(demo_game_1.coins, 0)
});

test('set coins to 100, then +50, -75', () => {
    demo_game_1._coins = 100
    assert.strictEqual(demo_game_1.coins, 100)
    demo_game_1.changeCoins(50)
    assert.strictEqual(demo_game_1.coins, 150)
    demo_game_1.changeCoins(-75)
    assert.strictEqual(demo_game_1.coins, 75)
});

const demo_game_2 = new Game()
demo_game_2._coins = 0
demo_game_2.changeCoins(200)
demo_game_2._pets = demo_game_2.serializePets()
console.log('Pet Set: ', demo_game_2._pets);
test('game 2 has 200 coins', () => {
    assert.strictEqual(demo_game_2.coins, 200)
});
test('game 2 pets', () => {

});

// demo_game_2.changeCoins(300)
// test('add 300 coins', () => {
//     expect(demo_game_2.coins).toBe(300);
// });

// // console.log(demo_game_3.coins)
// test('add 1000 coins', () => {
//     demo_game_3.changeCoins(1000)
//     expect(demo_game_3.coins).toBe(1000);
// });
// // console.log(demo_game_3.coins)
// test('buy a dog and 990 coins left', () => {
//     demo_game_3.buyPet('Dog')
//     expect(demo_game_3.pets["Dog"].bought).toBe(true);
//     expect(demo_game_3.coins).toBe(990);
// });
// // console.log(demo_game_3.coins)
// test('dog hp', () => {
//     expect(demo_game_3.pets["Dog"].hp).toBe(100);
// });

// demo_game_4.changeCoins(200)
// demo_game_4.buyPet('Dog')
// demo_game_4.buyPet('Cat')

// demo_game_4.changeAllHp(-20)
// test('remains 170 coins', () => {
//     expect(demo_game_4.coins).toBe(170);
// });
// test('dog -10 hp', () => {
//     expect(demo_game_4.pets["Dog"].hp).toBe(80);
// });
// test('cat -20 -10 hp', () => {
//     expect(demo_game_4.pets["Cat"].hp).toBe(80);
//     demo_game_4.changeHp('Cat', -10)
//     expect(demo_game_4.pets['Cat'].hp).toBe(70)
// });
// test('Horse is not bought, so 100 hp', () => {
//     expect(demo_game_4.pets["Horse"].hp).toBe(100);
// });
// test('dog & cat si bought, hourse is not bought', () => {
//     expect(demo_game_4.pets["Dog"].bought).toBe(true);
//     expect(demo_game_4.pets["Cat"].bought).toBe(true);
//     expect(demo_game_4.pets["Horse"].bought).toBe(false);
// });

// demo_game_5.changeCoins(100)
// demo_game_5.buyPet('Horse')
// test('Horse is bought', () => {
//     expect(demo_game_5.pets["Horse"].hp).toBe(100);
//     expect(demo_game_5.coins).toBe(50)
// });
// test('Horse -100 Hp, bought status should change back to false, and hp change back to 100', () => {
//     demo_game_5.changeHp('Horse', -100)
//     expect(demo_game_5.pets["Horse"].hp).toBe(100);
//     expect(demo_game_5.pets['Horse'].bought).toBe(false)
// });
