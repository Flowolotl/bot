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
    // console.log(reaction)
    // console.log(user.guild.roles.cache)
    console.log(reaction.emoji.name)

    if (reaction.emoji.name === "🎯") {
        let flag = user.member?.roles.cache.has("1284638359066513460")
        console.log(flag)
        if (flag) {
           return 
        }

        let role = reaction.message.guild.roles.cache.get("1284638359066513460")
        console.log(role)
        user.member?.roles.add(role)
    }
    // if (reaction.emoji.name === "🎯") {
        // if (user.id === reaction.message.author.id) {
            // reaction.message.reactions.removeAll()
            // reaction.message.edit("🎯")
        // }
    // }
    // else if (reaction.emoji.name === "👽") {
        // if (user.id === reaction.message.author.id) {
            // reaction.message.reactions.removeAll()
            // reaction.message.edit("👽")
        // }
    // }
}