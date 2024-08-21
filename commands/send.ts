import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { guildId, peter } from '../config.json'
import MessageInterface from '../class/MessageInterface';

const Messager = MessageInterface.getInstance();

async function iexecute(message, channel) {
    try {
        await channel.send(message)
    } catch (error) {
        await Messager.err({content: `Cannot send message '${message}'; Reason: ${error}`, ephemeral: true}) 
        return
    }
}

export const data = new SlashCommandBuilder()
    .setName('send')
    .setDescription('Sends a message as BingusBot')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('The user to send the message to')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export const execute = async (interaction) => {
    const message = interaction.options.getString('message')
    const channel = interaction.guild.channels.cache.get(peter)

    if (!message) {
        await interaction.reply({content: 'Please provide a message', ephemeral: true}) 
        return
    }

    iexecute(message, channel)
}