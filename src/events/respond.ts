import { Message } from "discord.js"

export const events = {
    MessageRespond: ["message", "messageCreate"],
}

const Keywords = {
    "https://tenor.com/view/bingus-bingus-combat-gif-24367941": (
        message: Message,
    ) => {
        message.channel.send("Attack Mode")
    },
    "nuh uh": (message: Message) => {
        message.reply(":badger:")
    },
    "spider-man|tom-holland|holland|peter-parker": (message: Message) => {
        message.react("🇨")
        message.react("🇷")
        message.react("🇮")
        message.react("🇳")
        message.react("🇬")
        message.react("🇪")
        message.react("🤮")
        message.react("🦡")
        message.react("🐎")
    },
}

export async function MessageRespond(message: Message) {
    if (message.author.bot) return
    if (
        message.channelId == "1281827815309967360" ||
        message.channelId == "1281838930630807613"
    )
        return

    // @ts-ignore
    for (const [keyword, func] of Object.entries(Keywords)) {
        let sep = keyword.split("|")
        if (sep.length > 0) {
            for (const keyword of sep) {
                if (message.content.includes(keyword)) {
                    func(message)
                }
            }
        } else {
            if (message.content.includes(keyword)) {
                func(message)
            }
        }
    }
}
