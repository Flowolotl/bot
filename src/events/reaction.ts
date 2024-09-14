import { RoleMessageId } from "./startup"

export const events = {
    Reaction: ["messageReactionAdd"],
}

export async function Reaction(reaction: any, user: any) {
    if (reaction.message.author.bot) return
    
    if (reaction.message.id !== RoleMessageId) {
        return
    }

    console.log(user.name)

    if (reaction.emoji.name === "🎯") {
        if (user.member?.roles.cache.has("1284638359066513460")) {
           return 
        }

        user.member?.roles.add(user.guild.roles.cache.get("1284638359066513460"))
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