function detectFootnoteCategory(text) {
    const regExample = new RegExp('(examples?)|(e\\.?g\\.?)|(ex\\.?)', "i");
    const regLink = new RegExp('https?:\/\/(.*)\.(.*)', "i");
    const regHints = new RegExp('hints?|tips?', "i");

    switch (true) {
        case (regLink.test(text)):
            return 3
        case (regExample.test(text)):
            return 1
        case (regHints.test(text)):
            return 2
        default: return 0
    }
}

module.exports = detectFootnoteCategory