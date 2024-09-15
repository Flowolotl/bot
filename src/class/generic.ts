export function FirstIndex(keyword: string, base: string): number {
    let regex = new RegExp(String.raw`${keyword.toLowerCase()}`, "g")
    let index: number = base.toLowerCase().search(regex)
    return index
}

export function GroupValues<Type>(
    list: Type[],
    valFunc: (arg1: Type, ...args: [Type]) => number,
    ...args: [Type]
): { [a: string | number]: Type } {
    let sameVal = {}
    for (let a of list) {
        let val = valFunc(a, ...args)
        if (sameVal[val] !== undefined) {
            sameVal[val].push(a)
        } else {
            sameVal[val] = [a]
        }
    }
    return sameVal
}

export function Choose(
    dictionary: { [a: string]: string },
    func: (a: string, b: string) => boolean,
): string[] {
    let entries = [] as string[]
    for (let index of Object.keys(dictionary)) {
        let survivor = ""
        for (let entry of dictionary[index]) {
            if (func(survivor, entry)) {
                survivor = entry
            }
        }
        if (survivor !== undefined) {
            entries.push(survivor as never)
        }
    }
    return entries
}
