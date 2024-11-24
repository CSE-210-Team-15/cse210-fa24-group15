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

    
   // console.log(demo_game_3.coins)
    test('add 1000 coins', () => {
        demo_game_3.changeCoins(1000)
        expect(demo_game_3.coins).toBe(1000);
    });
    // console.log(demo_game_3.coins)
    test('buy a dog and 990 coins left', () => {
        demo_game_3.buyPet('Dog')
        expect(demo_game_3.pets["Dog"].bought).toBe(true);
        expect(demo_game_3.coins).toBe(990);
    });
    // console.log(demo_game_3.coins)
    test('dog hp', () => {
        expect(demo_game_3.pets["Dog"].hp).toBe(100);
    });

    demo_game_4.changeCoins(200)
    demo_game_4.buyPet('Dog')
    demo_game_4.buyPet('Cat')
    
    demo_game_4.changeAllHp(-20)
    test('dog -10 hp', () => {
        expect(demo_game_4.pets["Dog"].hp).toBe(80);
    });
    test('cat -20 -10 hp', () => {
        expect(demo_game_4.pets["Cat"].hp).toBe(80);
        demo_game_4.changeHp('Cat', -10)
        expect(demo_game_4.pets['Cat'].hp).toBe(70)
    });
    test('Horse is not bought, so 100 hp', () => {
        expect(demo_game_4.pets["Horse"].hp).toBe(100);
    });
    test('dog & cat si bought, hourse is not bought', () => {
        expect(demo_game_4.pets["Dog"].bought).toBe(true);
        expect(demo_game_4.pets["Cat"].bought).toBe(true);
        expect(demo_game_4.pets["Horse"].bought).toBe(false);
    });


});
