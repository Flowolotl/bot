import { DMChannel, Message, time } from "discord.js"

export const events = {
    VastArchives: ["messageDelete"],
    TrueArchives: ["messageCreate"],
}

export async function TrueArchives(message: Message) {
    // because not all servers have archives

    const BingusDomainId = "1281819287140434001"

    if (message.guildId === BingusDomainId) {
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
            content: `${time(new Date())} **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}

export async function VastArchives(message: Message) {
    if (message.author?.bot) return

    const VastArchivesChannelId = "1281827815309967360"

    let attachments = []
    message.attachments.each(async (attachment) => {
        attachments.push(attachment.url as never)
    })

    if (message.channelId == VastArchivesChannelId) {
        message.channel.send({
            content: `## **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}
