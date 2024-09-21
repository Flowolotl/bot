import { GuildTextBasedChannel } from "discord.js"
import { mainGuildId } from "../assets/config.json"
import { GetOrSendMessage } from "../class/messages"
import { HandleCommands } from "../command-handler"
import { client } from "../index"
import { Roles } from "./reaction"

export let RoleMessageId = ""

export const InfoMessageContent =
    "# Guidelines\n## Use __Taxes__ for school related topics\n-# <#1281827710078947328> <#1281845492292259971> <#1281827609168056330>\n## Use __Commune__ for everything else\n-# <#1281826528522534932> <#1281845668654088274> <#1281819287669047471> <#1284666675156877342>\n\n# Rules\n## Racism is bad. Therefore, Bingus does not like it and might kill you.\n## To your best ability, don't be dumb."

export const RolesMessageContent =
    "# Roles\n## React with one of the corresponding emoji to get a role.\n-# Note that Funny/Business gives access to different channels.\n\n 🎯 -> Business \n 👽 -> Funny Business \n 🐀 -> Overwatch \n 💉 -> Titanfall \n ⛏️ -> Minecraft \n 💀 -> Terraria \n 🐱 -> Pokemon \n 🪿 -> Goose Duck \n 🟠 -> Rounds \n 💰 -> Lethal \n 🎨 -> Artist"

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

    let message = await GetOrSendMessage(InfoChannel, 0, InfoMessageContent)
    message?.edit(InfoMessageContent)
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
    let guild = client.guilds.cache.get(mainGuildId)

    const BingusMailingRole = guild.roles.cache.find(
        (role) => role.name === "Bingus Mailing List",
    )
    const Users = guild.members.cache.filter((member) =>
        member.roles.cache.has(BingusMailingRole.id),
    )

    for (const user of Users) {
        user[1].user.send(":alien:")
    }
}
