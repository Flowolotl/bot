import { SlashCommandBuilder } from "@discordjs/builders"
import {
    CommandInteraction,
    GuildBasedChannel,
    Message,
    PermissionFlagsBits,
} from "discord.js"

async function iexecute(
    message: Message,
    channel: GuildBasedChannel,
    interaction: CommandInteraction,
) {
    try {
        // @ts-ignore
        await channel.send(message)
    } catch (error) {
        interaction.reply({
            content: `Cannot send message '${message}'; Reason: ${error}`,
            ephemeral: true,
        })
        return
    }
}

export const data = new SlashCommandBuilder()
    .setName("send")
    .setDescription("Sends a message as BingusBot")
    .addStringOption((option) =>
        option
            .setName("message")
            .setDescription("The user to send the message to")
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export const execute = async (interaction: CommandInteraction) => {
    // @ts-ignore
    const message: Message = interaction.options.getString("message")
    const channel: GuildBasedChannel = interaction.guild?.channels.cache.get(
        "1142948495217660026",
    ) as GuildBasedChannel // temporary hardcoded solution

    if (!message) {
        await interaction.reply({
            content: "Please provide a message",
            ephemeral: true,
        })
        return
    }

    iexecute(message, channel, interaction)
}

