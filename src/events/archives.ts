import { DMChannel, Message, time } from "discord.js"
import { mainGuildId } from "../assets/config.json"
import { isSafe } from "../class/censor.ts"

export const events = {
    MessageUpdate: ["messageUpdate"],
    VastArchives: ["messageDelete"],
    TrueArchives: ["messageCreate"],
}

const TrueArchivesChannelId = "1281838930630807613"
const VastArchivesChannelId = "1281827815309967360"

let ignore = []

export async function MessageUpdate(oldMessage: Message, newMessage: Message) {
    let message = oldMessage
    if (message.guildId === mainGuildId) {
        if (message.author.bot) return
        if (oldMessage.id !== newMessage.id) return

        let attachments = []
        message.attachments.each(async (attachment) => {
            attachments.push(attachment.url as never)
        })

        if (message.channelId != VastArchivesChannelId) {
            // @ts-ignore
            const trueArchives = message.guild?.channels.cache.get(
                TrueArchivesChannelId,
            ) as DMChannel
            trueArchives.send({
                content: `${time(message.createdAt)} [${message.channel.name}] [edit] **${message.author?.username}:** ${newMessage.content}`,
                files: attachments,
            })
        } else {
            ignore.push(message.id as never)

            newMessage.reply({
                content: `${time(message.createdAt)} [before edit] **${message.author?.username}:** ${message.content}`,
                files: attachments,
            })
        }
    }
}

export async function TrueArchives(message: Message) {
    if (message.id in ignore) {
        ignore.splice(ignore.indexOf(message.id as never))
        return
    }
    if (message.guildId === mainGuildId) {
        if (message.author.bot) return

        let attachments = []
        message.attachments.each(async (attachment) => {
            attachments.push(attachment.url as never)
        })

        // @ts-ignore
        const trueArchives = message.guild?.channels.cache.get(
            TrueArchivesChannelId,
        ) as DMChannel

        trueArchives.send({
            content: `${time(message.createdAt)} [${message.channel.name}] **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}

export async function VastArchives(message: Message) {
    if (message.id in ignore) {
        ignore.splice(ignore.indexOf(message.id as never))
        return
    }
    if (message.author?.bot) return
    if (!isSafe(message.content)) return

    let attachments = []
    message.attachments.each(async (attachment) => {
        attachments.push(attachment.url as never)
    })

    if (message.channelId == VastArchivesChannelId) {
        message.channel.send({
            content: `${time(message.createdAt)} [${message.channel.name}] **${message.author?.username}:** ${message.content}`,
            files: attachments,
        })
    }
}
