import { RoleMessageId } from "./startup"

export const events = {
    ReactionAdd: ["messageReactionAdd"],
    ReactionRemove: ["messageReactionRemove"],
}

const Roles = {
    "🎯": "Business",
    "👽": "Funny Business",
}

export async function ReactionAdd(reaction: any, user: any) {
    if (user.bot) return
    
    if (reaction.message.id !== RoleMessageId) {
        return
    }

    console.log(user.username)
    console.log(reaction.emoji.name)

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