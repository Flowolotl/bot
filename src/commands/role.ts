import { SlashCommandBuilder } from "@discordjs/builders"
import {
    CommandInteraction,
    GuildMember,
    PermissionFlagsBits,
    Role,
} from "discord.js"

async function iexecute(
    member: GuildMember,
    role: Role,
    interaction: CommandInteraction,
) {
    if (member.roles.cache.has(role.id)) {
        interaction.reply({
            content: `User '${member.user.username}' already has the role '${role.name}'`,
        })
        return
    }

    try {
        await member.roles.add(role)
    } catch (error) {
        interaction.reply({
            content: `Cannot add role '${role.name}' to user '${member.user.username}'; Reason: ${error}`,
            ephemeral: true,
        })
        return
    }

    interaction.reply({
        content: `Successfully added role '${role.name}' to user '${member.user.username}'`,
        ephemeral: true,
    })
}

export const data = new SlashCommandBuilder()
    .setName("role")
    .setDescription("Gives a role to the user")
    .addUserOption((option) =>
        option
            .setName("user")
            .setDescription("The user to give the role to")
            .setRequired(true),
    )
    .addRoleOption((option) =>
        option
            .setName("role")
            .setDescription("The role to give the user")
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export const execute = async (interaction: CommandInteraction) => {
    // @ts-ignore
    const user = interaction.options.getUser("user")
    // @ts-ignore
    const role = interaction.options.getRole("role")

    if (!user || !role) {
        await interaction.reply({
            content: "Please provide a valid user and a role",
            ephemeral: true,
        })
        return
    }

    const member: GuildMember = (await interaction.guild?.members.fetch(
        user.id,
    )) as GuildMember

    iexecute(member, role, interaction)
}
