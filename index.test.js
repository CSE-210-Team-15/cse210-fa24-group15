const Game = require('./petBlock/Game');


demo_game_1 = new Game()
demo_game_2 = new Game()
demo_game_3 = new Game()


describe("detect Footnote Category", () => {
    test('origional coin', () => {
      expect(demo_game_1.coins).toBe(0);
    });
    demo_game_2.changeCoins(300)
    test('add 300 coins', () => {
      expect(demo_game_2.coins).toBe(300);
    });
    // demo_game_3.changeCoins(1000)
    // test('add 1000 coins', () => {
    //   expect(demo_game_3.coins).toBe(1000);
    // });
    demo_game_3.buyPet('Dog')
    test('buy a dog', () => {
      expect(demo_game_3.pets["Dog"].bought).toBe(true);
    });
    test('dog hp', () => {
      expect(demo_game_3.pets["Dog"].hp).toBe(100);
    });


});
