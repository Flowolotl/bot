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
    console.log(reaction.emoji.name == "🎯")
    console.log(reaction.emoji.name === "🎯")

    if (reaction.emoji.name === "🎯") {
        if (user.member?.roles.cache.has("1284638359066513460")) {
           return 
        }

        user.member?.roles.add(reaction.message.guild.roles.cache.get("1284638359066513460"))
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