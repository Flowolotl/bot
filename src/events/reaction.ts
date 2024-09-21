import { GuildMember, Role } from "discord.js"
import { RoleMessageId } from "./startup"

export const events = {
    ReactionAdd: ["messageReactionAdd"],
    ReactionRemove: ["messageReactionRemove"],
}

export const Roles = {
    "🎯": "Business",
    "👽": "Funny Business",
    "📬": "Bingus Mailing List",
    "🐀": "Overwatch",
    "💉": "Titanfall",
    "⛏️": "Minecraft",
    "🪿": "Goose Duck",
    "🟠": "Rounds",
    "💰": "Lethal",
    "🎨": "Artist",
    "🤓": "Physics Addiction",
}

function ValidReaction(reaction: any, user: any) {
    if (user.bot) return false
    if (reaction.message.id !== RoleMessageId) return false

    return true
}

export async function ReactionAdd(reaction: any, user: any) {
    if (!ValidReaction(reaction, user)) return

    let member = reaction.message.guild.members.cache.get(user.id)

    for (let emoji in Roles) {
        if (reaction.emoji.name === emoji) {
            let role = reaction.message.guild.roles.cache.find(
                (role: Role) => role.name === Roles[emoji],
            )
            let flag = !member.roles.cache.has(role.id)
            if (flag) {
                member.roles.add(role)
            }
        }
    }
}

export async function ReactionRemove(reaction: any, user: any) {
    if (!ValidReaction(reaction, user)) return

    let member: GuildMember = reaction.message.guild.members.cache.get(user.id)

    for (let emoji in Roles) {
        if (reaction.emoji.name === emoji) {
            let role = reaction.message.guild.roles.cache.find(
                (role: Role) => role.name === Roles[emoji],
            )
            let flag = member.roles.cache.has(role.id)
            if (flag) {
                member.roles.remove(role)
            }
        }
    }
}
