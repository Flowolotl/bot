import { Client, GatewayIntentBits } from 'discord.js'
import WebSocket from 'ws'
import { token, guildId, port } from './config.json'
import { HandleCommands } from './command-handler'
import { checkAndSetNickname } from './nickname'
import MessageInterface from './class/MessageInterface'

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences]})
const wss = new WebSocket.WebSocketServer({ port: port }); 

const Messager = MessageInterface.getInstance();

let requiredCommands

client.once('ready', async () => {
    if (client.user !== null) {
        requiredCommands = await HandleCommands(client)
        console.log(`Logged in as ${client.user.tag}`);

        let guild = client.guilds.cache.get(guildId)
        if (guild !== undefined) {
            guild.members.cache.forEach(async member => {
                checkAndSetNickname(member)
            })
        }
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log(oldMember.nickname, newMember.nickname)
    checkAndSetNickname(newMember)
})

wss.on('connection', ws => {
    Messager.__ws(ws)
    ws.on('message', async data => {
        let payload = data.toString().split(' ')
        console.log(payload)
        let command = payload[0]
        if (command in requiredCommands) {
            requiredCommands[command].iExecute(client, ...payload.slice(1))
        }
    });
    ws.on('close', () => {
        Messager.__ws(null)
    });
});

client.login(token)