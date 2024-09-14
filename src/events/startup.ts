import { GuildTextBasedChannel } from "discord.js"
import { InfoMessageContent, RolesMessageContent } from "../assets/config.json"
import { HandleCommands } from "../command-handler"
import { client } from "../index"

export const events = {
    Startup: ["ready"],
    InfoMessage: ["ready"],
    RolesMessage: ["ready"],
}

export async function Startup() {
    if (client.user === null) return

    await HandleCommands(client)

    console.log(`Logged in as ${client.user.tag}`)
}

async function GetMessage(channel: GuildTextBasedChannel, indexFromEnd: number) {
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

async function GetOrSendMessage(channel: GuildTextBasedChannel, indexFromEnd: number, content: string) {
    let message = await GetMessage(channel, indexFromEnd)

    if (message === null) {
        message = await channel.send(content)
    }

    return message
}

export async function InfoMessage() {
    const InfoChannelId = "1281826640028106752"
    const InfoChannel: GuildTextBasedChannel = client.channels.cache.get(
        InfoChannelId,
    ) as GuildTextBasedChannel

    GetOrSendMessage(InfoChannel, 0, InfoMessageContent)

    // InfoChannel.messages.fetch().then((messages) => {
        // if (messages.size > 0) {
            // messages.last()?.edit(InfoMessageContent)
        // } else {
            // InfoChannel.send(InfoMessageContent)
        // }
    // })
}

export let RoleMessageId = ""

export async function RolesMessage() {
    const RolesChannelId = "1281826640028106752"
    const RolesChannel: GuildTextBasedChannel = client.channels.cache.get(
        RolesChannelId,
    ) as GuildTextBasedChannel

    let message = await GetOrSendMessage(RolesChannel, 1, RolesMessageContent)

    await message.reactions.removeAll()
    message?.edit(RolesMessageContent)

    message.react("🎯")
    message.react("👽")

    RoleMessageId = message.id
}
