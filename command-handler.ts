import { Client, Collection, Events } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

export async function HandleCommands(client: Client) : Promise<any> {
    client.commands = new Collection()

    const foldersPath = path.join(__dirname, 'commands')
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.ts'))

    let requiredCommands = {}

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
            requiredCommands[command.data.name] = command
        } else{
            console.log(`Command ${command.data.name} is missing data or execute!`)
        }
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
    return requiredCommands
}
