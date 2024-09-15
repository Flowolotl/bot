import { GuildMember } from "discord.js"
import fs from "node:fs"
import path from "node:path"

export const events = {
    InsistNickname: ["guildMemberUpdate"],
}

const nicksFilePath = path.join(__dirname, "../assets/nicks.json")

export async function InsistNickname(
    _oldMember: GuildMember,
    newMember: GuildMember,
) {
    const member = newMember

    if (!member.bannable) return // bot doesn't have perms to change server owner nickname 

    let nicksData: any
    try {
        nicksData = JSON.parse(fs.readFileSync(nicksFilePath, "utf8"))
    } catch (error) {
        console.error(`Error reading nicks file: ${error}`)
        return
    }
    const newNickname = nicksData[member.user.id]
    if (newNickname) {
        if (member.nickname !== newNickname) {
            member.setNickname(newNickname).then().catch()
        }
    }
}
