import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import MessageInterface from '../class/MessageInterface'

export const data = new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Changes the nickname of the user')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to change the nickname of')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('nick')
            .setDescription('The new nickname')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute(interaction) {
    const user = interaction.options.getUser('user')
    const nick = interaction.options.getString('nick')

    if (!user || !nick) {
        await interaction.reply({content: 'Please provide a valid user and a nickname', ephemeral: true}) 
        return
    }

    const member = await interaction.guild.members.fetch(user.id)
    
    const nicksFilePath = path.join(__dirname.replace("/commands", ""), 'nicks.json');
    let nicksData;
    try {
        nicksData = JSON.parse(fs.readFileSync(nicksFilePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading nicks file: ${error}`);
        return;
    }
    nicksData[user.id] = nick;
    fs.writeFileSync(nicksFilePath, JSON.stringify(nicksData, null, 4));
    
    if (member.nickname !== nick) {
        await member.setNickname(nick)
        .then(console.log(`Successfully changed nickname to ${nick}`))
        .catch(console.log(`Failed to change nickname to ${nick}`))
    }
    
    await interaction.reply({content: `Successfully changed nickname to ${nick}`, ephemeral: true})
}
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('nick')
//         .setDescription('Changes the nickname of the user')
//         .addUserOption(option =>
//             option.setName('user')
//                 .setDescription('The user to change the nickname of')
//                 .setRequired(true)
//         )
//         .addStringOption(option =>
//             option.setName('nick')
//                 .setDescription('The new nickname')
//                 .setRequired(true)
//         )
//         .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
//     async execute(interaction) {
//         const user = interaction.options.getUser('user')
//         const nick = interaction.options.getString('nick')

//         if (!user || !nick) {
//             await interaction.reply({content: 'Please provide a valid user and a nickname', ephemeral: true}) 
//             return
//         }

//         const member = await interaction.guild.members.fetch(user.id)
        
//         const nicksFilePath = path.join(__dirname.replace("/commands", ""), 'nicks.json');
//         let nicksData;
//         try {
//             nicksData = JSON.parse(fs.readFileSync(nicksFilePath, 'utf8'));
//         } catch (error) {
//             console.error(`Error reading nicks file: ${error}`);
//             return;
//         }
//         nicksData[user.id] = nick;
//         fs.writeFileSync(nicksFilePath, JSON.stringify(nicksData, null, 4));
        
//         if (member.nickname !== nick) {
//             await member.setNickname(nick)
//             .then(console.log(`Successfully changed nickname to ${nick}`))
//             .catch(console.log(`Failed to change nickname to ${nick}`))
//         }
        
//         await interaction.reply({content: `Successfully changed nickname to ${nick}`, ephemeral: true})
//     }
// }