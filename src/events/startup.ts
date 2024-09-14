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

export async function InfoMessage() {
    const InfoChannelId = "1281826640028106752"
    const InfoChannel: GuildTextBasedChannel = client.channels.cache.get(
        InfoChannelId,
    ) as GuildTextBasedChannel

    InfoChannel.messages.fetch().then((messages) => {
        if (messages.size > 0) {
            messages.last()?.edit(InfoMessageContent)
        } else {
            InfoChannel.send(InfoMessageContent)
        }
    })
}

export let RoleMessageId = ""

export async function RolesMessage() {
    const RolesChannelId = "1281826640028106752"
    const RolesChannel: GuildTextBasedChannel = client.channels.cache.get(
        RolesChannelId,
    ) as GuildTextBasedChannel

    RolesChannel.messages.fetch().then((messages) => {
        let message
        if (messages.size > 1) {
            message = messages.get(messages.size - 1)
            // message.reactions.removeAll()
            // message?.edit(RolesMessageContent)
        } else {
            RolesChannel.send(RolesMessageContent).then((sent_message) => {
                message = sent_message
                sent_message.react(":dart:")
                sent_message.react(":alien:")
            }) 
        }
        // RoleMessageId = message.id
    })
}
