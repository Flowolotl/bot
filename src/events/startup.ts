import { GuildTextBasedChannel } from "discord.js"
import { InfoMessageContent } from "../assets/config.json"
import { HandleCommands } from "../command-handler"
import { client } from "../index"

export const events = {
    Startup: ["ready"],
    InfoMessage: ["ready"],
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
