import { RoleMessageId } from "./startup"

export const events = {
    ReactionAdd: ["messageReactionAdd"],
    ReactionRemove: ["messageReactionRemove"],
}

const Roles = {
    "🎯": "Business",
    "👽": "Funny Business",
}

function ValidReaction(reaction: any, user: any) {
    if (user.bot) return false
    if (reaction.message.id !== RoleMessageId) return false

    return true
}

export async function ReactionAdd(reaction: any, user: any) {
    if (!(ValidReaction(reaction, user))) return
    
    let member = reaction.message.guild.members.cache.get(user.id)

    for (let emoji in Roles) {
        if (reaction.emoji.name === emoji) {
            let role = reaction.message.guild.roles.cache.find((role) => role.name === Roles[emoji])
            let flag = !member.roles.cache.has(role.id)
            if (flag) {
                member.roles.add(role)
            }
        }
    }

    // if (reaction.emoji.name === "🎯") {
        // let role = reaction.message.guild.roles.cache.find((role) => role.name === "Business")
        // let flag = !member.roles.cache.has(role.id)
        // if (flag) {
            // member.roles.add(role)
        // }
    // }
}

export async function ReactionRemove(reaction: any, user: any) {
    if (!(ValidReaction(reaction, user))) return

    let member = reaction.message.guild.members.cache.get(user.id)

    for (let emoji in Roles) {
        if (reaction.emoji.name === emoji) {
            let role = reaction.message.guild.roles.cache.find((role) => role.name === Roles[emoji])
            let flag = member.roles.cache.has(role.id)
            if (flag) {
                member.roles.remove(role)
            }
        }
    }
}