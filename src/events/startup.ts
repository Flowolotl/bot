import { GuildTextBasedChannel } from "discord.js"
import { InfoMessageContent, RolesMessageContent } from "../assets/config.json"
import { HandleCommands } from "../command-handler"
import { client } from "../index"
import { GetOrSendMessage } from "../class/messages"
import { Roles } from "./reaction"

export let RoleMessageId = ""

export const events = {
    Startup: ["ready"],
    InfoMessage: ["ready"],
    RolesMessage: ["ready"],
    BingusMailingList: ["ready"],
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

    GetOrSendMessage(InfoChannel, 0, InfoMessageContent)
}

export async function RolesMessage() {
    const RolesChannelId = "1281826640028106752"
    const RolesChannel: GuildTextBasedChannel = client.channels.cache.get(
        RolesChannelId,
    ) as GuildTextBasedChannel

    let content = RolesMessageContent
    for (const role of Object.keys(Roles)) {
        content += `\n ${role} -> ${Roles[role]} `
    }
    
    let message = await GetOrSendMessage(RolesChannel, 1, content)

    await message.reactions.removeAll()
    message?.edit(content)

    for (const role of Object.keys(Roles)) {
        message.react(role)
    }

    RoleMessageId = message.id
}

export async function BingusMailingList() {
    let guild = client.guild
    
    const BingusMailingRole = guild.roles.cache.find((role) => role.name === "Bingus Mailing List")
    const Users = guild.members.cache.filter((member) => (member.roles.cache.has(BingusMailingRole.id)))

    for (const user of Users) {
        user.send(":alien:")
    }
}
