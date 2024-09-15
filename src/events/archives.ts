import { DMChannel, Message, time } from "discord.js"
import { mainGuildId } from "../assets/config.json"
import { isSafe } from "../class/censor.ts"

export const events = {
    VastArchives: ["messageDelete"],
    TrueArchives: ["messageCreate"],
}

export async function TrueArchives(message: Message) {
    if (message.guildId === mainGuildId) {
        if (message.author.bot) return

        const TrueArchivesChannelId = "1281838930630807613"

        let attachments = []
        message.attachments.each(async (attachment) => {
            attachments.push(attachment.url as never)
        })

        // @ts-ignore
        const trueArchives = message.guild?.channels.cache.get(
            TrueArchivesChannelId,
        ) as DMChannel

        trueArchives.send({
            content: `${time(new Date())} [${message.channel.name}] **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}

export async function VastArchives(message: Message) {
    if (message.author?.bot) return
    if (!isSafe(message.content)) return

    const VastArchivesChannelId = "1281827815309967360"

    let attachments = []
    message.attachments.each(async (attachment) => {
        attachments.push(attachment.url as never)
    })

    if (message.channelId == VastArchivesChannelId) {
        message.channel.send({
            content: `${time(new Date())}## **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}
