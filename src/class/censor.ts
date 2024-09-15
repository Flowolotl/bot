let words = require("../assets/censor.json")

export function Safe(str: string): boolean {
    for (let a of words) {
        let word: string = a
        let index: number = str.search(`/${word}/gm`)
        if (index > -1) {
            console.log(str, word, index)
            return false
        }
    }
    return true
}
