import { SlashCommandBuilder } from "@discordjs/builders"
import {
    CommandInteraction,
    GuildMember,
    PermissionFlagsBits,
} from "discord.js"
import fs from "node:fs"
import path from "node:path"

export const data = new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Changes the nickname of the user")
    .addUserOption((option) =>
        option
            .setName("user")
            .setDescription("The user to change the nickname of")
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName("nick")
            .setDescription("The new nickname")
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute(interaction: CommandInteraction) {
    // @ts-ignore
    const user = interaction.options.getUser("user")
    // @ts-ignore
    const nick = interaction.options.getString("nick")

    if (!user || !nick) {
        await interaction.reply({
            content: "Please provide a valid user and a nickname",
            ephemeral: true,
        })
        return
    }

    const member: GuildMember = (await interaction.guild?.members.fetch(
        user.id,
    )) as GuildMember

    const nicksFilePath = path.join(
        __dirname.replace("/commands", ""),
        "nicks.json",
    )
    let nicksData: any
    try {
        nicksData = JSON.parse(fs.readFileSync(nicksFilePath, "utf8"))
    } catch (error) {
        console.error(`Error reading nicks file: ${error}`)
        return
    }
    nicksData[user.id] = nick
    fs.writeFileSync(nicksFilePath, JSON.stringify(nicksData, null, 4))

    if (member.nickname !== nick) {
        await member
            .setNickname(nick)
            // @ts-ignore
            .then(console.log(`Successfully changed nickname to ${nick}`))
            // @ts-ignore
            .catch(console.log(`Failed to change nickname to ${nick}`))
    }

    await interaction.reply({
        content: `Successfully changed nickname to ${nick}`,
        ephemeral: true,
    })
}

