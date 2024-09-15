import { GuildTextBasedChannel } from "discord.js"

export async function GetMessage(channel: GuildTextBasedChannel, indexFromEnd: number) {
    return await channel.messages.fetch().then((messages) => {
        if (messages.size > indexFromEnd) {
            let messageArray = Array.from(messages.values())
            let message = messageArray[messageArray.length - indexFromEnd - 1]
            return message
        } else {
            return null
        }
    })
}

export async function GetOrSendMessage(channel: GuildTextBasedChannel, indexFromEnd: number, content: string) {
    let message = await GetMessage(channel, indexFromEnd)

    if (message === null) {
        message = await channel.send(content)
    }

    return message
}