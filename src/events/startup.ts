import { GuildMember, GuildTextBasedChannel, User } from "discord.js"
import { mainGuildId } from "../assets/config.json"
import { GetOrSendMessage } from "../class/messages"
import { HandleCommands } from "../command-handler"
import { client } from "../index"
import { Roles } from "./reaction"

export let RoleMessageId = ""

export const InfoMessageContent =
    "# Guidelines\n## Use __Taxes__ for school related topics\n-# <#1281827710078947328> <#1281845492292259971> <#1281827609168056330>\n## Use __Commune__ for everything else\n-# <#1281826528522534932> <#1281845668654088274> <#1281819287669047471> <#1284666675156877342>\n\n# Rules\n## Racism is bad. Therefore, Bingus does not like it and might kill you.\n## To your best ability, don't be dumb."

export const RolesMessageContent =
    "# Roles\n## React with one of the corresponding emoji to get a role.\n-# Note that Funny/Business gives access to Commune/Taxes.\n"

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

    const BingusMailingRole = guild?.roles.cache.find(
        (role) => role.name === "Bingus Mailing List",
    )
    const Users = guild?.members.cache.filter((member) =>
        member.roles.cache.has(BingusMailingRole.id),
    )

    let commit_message = ""

    commit_message = await fetch(
        "https://api.github.com/repos/Flowolotl/bot/commits?per_page=1",
    )
        .then((res) => res.json())
        .then((res) => {
            return res[0].commit.message
        })

    console.log(commit_message)
    for (const gm of Users) {
        let member: GuildMember = gm[1]
        let user: User = member.user

        if (user.username == "egg879") {
        }
        user.send(`-# ${commit_message}`)
        user.send(":alien:")
    }
}
