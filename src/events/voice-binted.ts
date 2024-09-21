import { VoiceState } from "discord.js"
import { joinCall } from "../class/voice.ts"
import { client } from "../index.ts"

export const events = {
    Bint: ["voiceStateUpdate"],
}

export async function Bint(oldMember: VoiceState, newMember: VoiceState) {
    let guild = newMember.guild
    if (
        oldMember.channelId !== newMember.channelId &&
        newMember.channelId !== null &&
        newMember.member?.user.bot === false
    ) {
        let rand = Math.round(Math.random() * 100)
        if (rand < 5) {
            joinCall(newMember.channelId, guild.id, client)
        }
    }
}
