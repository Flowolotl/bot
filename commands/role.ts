import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { guildId } from '../config.json'
import MessageInterface from '../class/MessageInterface';

const Messager = MessageInterface.getInstance();

async function iexecute(member, role, username, rolename, interaction?: CommandInteraction) {
    
    if (member.roles.cache.has(role.id)) {
        await Messager.err({content: `User '${member.user.username}' already has the role '${rolename}'`, ephemeral: true}, interaction)  
        return
    }

    try {
        await member.roles.add(role)
    } catch (error) {
        await Messager.err({content: `Cannot add role '${rolename}' to user '${member.user.username}'; Reason: ${error}`, ephemeral: true}, interaction) 
        return
    }
    await Messager.ok({content: `Successfully added role '${rolename}' to user '${member.user.username}'`, ephemeral: true}, interaction)
}

export const data = new SlashCommandBuilder()
    .setName('role')
    .setDescription('Gives a role to the user')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to give the role to')
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName('role')
            .setDescription('The role to give the user')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export const execute = async (interaction) => {
    const user = interaction.options.getUser('user')
    const role = interaction.options.getRole('role')

    if (!user || !role) {
        await interaction.reply({content: 'Please provide a valid user and a role', ephemeral: true}) 
        return
    }

    const member = await interaction.guild.members.fetch(user.id)

    iexecute(member, role, user.username, role.name, interaction)
}

export const iExecute = async (client, username, rolename) => {
    const user = client.guilds.cache.get(guildId).members.cache.find(member => member.user.username === username)
    const role = client.guilds.cache.get(guildId).roles.cache.find(r => r.name === rolename)

    if (!user || !role) {
        console.log(`User ${username} or role ${rolename} not found`)
        return
    }

    const member = await client.guilds.cache.get(guildId).members.fetch(user.id)
    iexecute(member, role, member.user.username, role.name)
}
