import { REST, Routes } from 'discord.js';
import { clientId, token } from './src/assets/config.json'
import fs from 'node:fs'
import path from 'node:path';

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON() as never);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, "1281819287140434001"),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
