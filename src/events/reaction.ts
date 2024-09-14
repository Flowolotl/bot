import { RoleMessageId } from "./startup"
import { client } from "../index"

export const events = {
    Reaction: ["messageReactionAdd"],
}

export async function Reaction(reaction: any, user: any) {
    if (user.bot) return
    
    if (reaction.message.id !== RoleMessageId) {
        return
    }

    console.log(user.username)
    console.log(reaction.emoji.name)

    let member = reaction.message.guild.members.cache.get(user.id)

    if (reaction.emoji.name === "🎯") {
        let flag = member.roles.cache.has("1284638359066513460")
        console.log(flag)
        if (flag) {
           return 
        }

        let role = reaction.message.guild.roles.cache.get("1284638359066513460")
        member.roles.add(role)
    }
    // else if (reaction.emoji.name === "👽") {
        // if (user.id === reaction.message.author.id) {
            // reaction.message.reactions.removeAll()
            // reaction.message.edit("👽")
        // }
    // }
}