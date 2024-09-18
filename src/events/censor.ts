import { Message } from "discord.js"
import { Clean, isSafe } from "../class/censor.ts"
import { FirstIndex } from "../class/generic.ts"

export const events = {
    CensorMessages: ["messageCreate"],
}

export async function CensorMessages(message: Message) {
    if (message.author.bot) return
    if (isSafe(message.content)) return
    if (
        FirstIndex("http", message.content) == 0 &&
        /^\S+$/g.test(message.content)
    ) {
        return
    }

    let channel = message.channel
    let clean = Clean(message.content)

    message.delete()
    channel.send(`${message.author}: ${clean}`)
}
