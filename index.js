const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js')
const { token, clientId, guildId } = require('./config.json')

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences]})

const nicksFilePath = path.join(__dirname, 'nicks.json');

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
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

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log(oldMember.nickname, newMember.nickname)
    let nicksData;
    try {
        nicksData = JSON.parse(fs.readFileSync(nicksFilePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading nicks file: ${error}`);
        return;
    }
    const newNickname = nicksData[newMember.user.id];
    if (newNickname) {
        if (newMember.nickname !== newNickname) {
            await newMember.setNickname(newNickname)
            .then(console.log(`Successfully changed nickname to ${newNickname}`))
            .catch(console.log(`Failed to change nickname to ${newNickname}`))
        }
    }
})

client.login(token)