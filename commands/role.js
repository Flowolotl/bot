const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const role = interaction.options.getRole('role')

        if (!user || !role) {
            await interaction.reply({content: 'Please provide a valid user and a role', ephemeral: true}) 
            return
        }

        const member = await interaction.guild.members.fetch(user.id)
        
        if (member.roles.cache.has(role.id)) {
            await interaction.reply({content: `${user.username} already has the role ${role.name}`, ephemeral: true})
            return
        }

        await member.roles.add(role)
        await interaction.reply({content: `Successfully added ${role.name} to ${user.username}`, ephemeral: true})
    }
}