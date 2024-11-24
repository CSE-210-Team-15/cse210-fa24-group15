const Game = require('./petBlock/Game');


demo_game_1 = new Game()
demo_game_2 = new Game()
demo_game_3 = new Game()
demo_game_4 = new Game()


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

    demo_game_4.buyPet('Dog')
    demo_game_4.buyPet('Cat')
    demo_game_4.changeHp('Cat', -10)
    demo_game_4.changeAllHp(-20)
    test('dog -10 hp', () => {
        expect(demo_game_4.pets["Dog"].hp).toBe(80);
    });
    test('cat -30 hp', () => {
        expect(demo_game_4.pets["Cat"].hp).toBe(70);
    });


});
