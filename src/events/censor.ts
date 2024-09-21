import { Message } from "discord.js"
import { Clean, isSafe } from "../class/censor.ts"
import { FirstIndex } from "../class/generic.ts"

export const events = {
    CensorMessages: ["messageCreate"],
    CensorEdits: ["messageUpdate"],
}

async function Common(message: Message, annotation: string) {
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

    let content: string
    if (annotation != "") {
        content = `${message.author} ${annotation}: ${clean}`
    } else {
        content = `${message.author}: ${clean}`
    }
    channel.send(content)
}

export async function CensorEdits(_oldMessage: Message, newMessage: Message) {
    Common(newMessage, "[edit]")
}

export async function CensorMessages(message: Message) {
    Common(message, "")
}
