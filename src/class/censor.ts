import { Choose, FirstIndex, GroupValues } from "./generic"
let words: [string] = require("../assets/censor.json")

interface Censor {
    safe: boolean
    foundTerms: string[]
}

const whitelist = ["document", "cucumber"]

export function isSafe(str: string): boolean {
    for (let word of words) {
        let firstIndex = FirstIndex(word, str)
        if (firstIndex > -1) {
            let skip = false
            for (let ok of whitelist) {
                if (
                    str
                        .slice(firstIndex - 4, firstIndex + 8)
                        .toLowerCase()
                        .search(
                            new RegExp(String.raw`${ok.toLowerCase()}`, "g"),
                        )
                ) {
                    skip = true
                }
            }
            return skip
        }
    }
    return true
}

export function CensorData(str: string): Censor {
    let safe = true
    let foundTerms: string[] = [] as string[]
    for (let word of words) {
        let index = FirstIndex(word, str)
        if (index > -1) {
            safe = false
            foundTerms.push(word as never)
        }
    }
    return { safe: safe, foundTerms: foundTerms }
}

export function Clean(str: string): string {
    let StringCensor = CensorData(str)

    if (StringCensor.safe) {
        return str
    }

    let returnString = str

    let sameIndex = GroupValues<string>(
        StringCensor.foundTerms,
        FirstIndex,
        returnString,
    )

    let foundTerms = Choose(
        sameIndex,
        (a: string, b: string) => a.length < b.length,
    )

    let UpdateCensor: Censor
    let foundIndex: number = 0

    for (let term of foundTerms) {
        while (foundIndex != -1) {
            UpdateCensor = CensorData(returnString)
            if (UpdateCensor.safe) {
                break
            }

            foundIndex = FirstIndex(term, returnString)

            let length = term.length

            let section1 = returnString.substring(0, foundIndex)
            let replacement = "-".repeat(length)
            let section2 = returnString.substring(
                foundIndex + length,
                returnString.length,
            )

            returnString = section1 + replacement + section2
        }
    }

    return returnString
}
