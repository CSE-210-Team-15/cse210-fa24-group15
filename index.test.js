const detectFootnoteCategory = require('./test_demo');

describe("detect Footnote Category", () => {
    test('http 1', () => {
      expect(detectFootnoteCategory('http://helloworld.com')).toBe(3);
    });
    test('http 2', () => {
      expect(detectFootnoteCategory('https://wiki.com/content')).toBe(3);
    });

    test('hint 1', () => {
      expect(detectFootnoteCategory('hints: this is a hink')).toBe(2);
    });
    test('hint 2', () => {
      expect(detectFootnoteCategory('hint: here is a hint')).toBe(2);
    });
    test('tip 1', () => {
      expect(detectFootnoteCategory('tip: do not commit to main')).toBe(2);
    });
    test('tip 2', () => {
      expect(detectFootnoteCategory('tips: here is a tip')).toBe(2);
    });

    test('example 1', () => {
      expect(detectFootnoteCategory('exmaple 1: this is an example.')).toBe(1);
    });
    test('example 2', () => {
      expect(detectFootnoteCategory('eg: example')).toBe(1);
    });
    test('example 3', () => {
      expect(detectFootnoteCategory('e.g. here is an example')).toBe(1);
    });
    test('example 4', () => {
      expect(detectFootnoteCategory("ex: it's also an example")).toBe(1);
    });
    test('example 5 (a hint but is example)', () => {
      expect(detectFootnoteCategory("hint: here is an example ...")).toBe(1);
    });

    test('default 1', () => {
      expect(detectFootnoteCategory("it is default!")).toBe(0);
    });
    test('default 2', () => {
      expect(detectFootnoteCategory("The efficiency of solar panels has increased from about 15% to over 22% in the last decade.</span>. Many countries are now investing heavily in solar infrastructure to meet their energy needs while reducing their carbon footprint.")).toBe(0);
    });


});
