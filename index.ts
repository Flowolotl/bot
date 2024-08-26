import { Client, GatewayIntentBits, Guild, GuildMember } from 'discord.js'
import WebSocket from 'ws'
import { OpenAI } from 'openai'
import { token, guildId, port, peter, openaiKey } from './config.json'
import { HandleCommands } from './command-handler'
import { checkAndSetNickname } from './nickname'
import MessageInterface from './class/MessageInterface'
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection, AudioPlayer, AudioResource, DiscordGatewayAdapterCreator} from "@discordjs/voice"

const milkId = "173662116975345664"
const eggId = "1026283098360512602"
const gbossId = "792082410518216724"

let connection: VoiceConnection | undefined = undefined
let audioPlayer: AudioPlayer | undefined = undefined

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildVoiceStates]})
const wss = new WebSocket.WebSocketServer({ port: port }); 
const openai = new OpenAI({ apiKey: openaiKey })


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
                if (member.user.id === eggId) {
                    member.send(":alien:")
                }
            })
        }
    }
});

function joinCall(channelId: string) {
    if (connection !== undefined) {
        connection.disconnect()
        connection = undefined
    }
    if (audioPlayer !== undefined) {
        audioPlayer.stop()
        audioPlayer = undefined
    }
    let audioResource: AudioResource = createAudioResource("./audio.mp3")
    audioPlayer = createAudioPlayer()
    audioPlayer.play(audioResource)
    connection = joinVoiceChannel({channelId: channelId, guildId: guildId, adapterCreator: client.guilds.cache.get(guildId)?.voiceAdapterCreator as DiscordGatewayAdapterCreator, selfDeaf: false})
    let subscription = connection.subscribe(audioPlayer)
    setTimeout(async () => {
        // @ts-ignore
        if (audioPlayer !== undefined) {
            audioPlayer.stop()
            audioPlayer = undefined
        }
        // @ts-ignore
        if (connection !== undefined) {
            connection.disconnect()
            connection = undefined
        }
        subscription?.unsubscribe()
    }, 3000)
}

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (oldMember.channelId !== newMember.channelId && newMember.channelId !== null && newMember.member?.user.bot === false) {
        let rand = Math.round(Math.random() * 100)
        if (rand < 25) {
            joinCall(newMember.channelId)
        }
    }
})

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log(oldMember.nickname, newMember.nickname)
    checkAndSetNickname(newMember)
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    console.log(message.content)

    let user = message.author
    let guild = message.guild as Guild
    let member = guild?.members.cache.get(user.id) as GuildMember

    if (message.content.includes("https://tenor.com") && (message.content.includes("peter-parker") || message.content.includes("tom-holland") || message.content.includes("holland") || message.content.includes("spider-man"))) {
        message.react("🇨")
        message.react("🇷")
        message.react("🇮")
        message.react("🇳")
        message.react("🇬")
        message.react("🇪")
        message.react("🤮")
        message.react(":badger:")
        message.react(":horse:")
    }

    if (message.content.includes("https://tenor.com/view/bingus-bingus-combat-gif-24367941")) {
        message.channel.send("Attack Mode: On")
    }

    if (message.content.includes("nuh uh")) {
        message.reply(":badger: unfunny")
    }
})

client.on("typingStart", (typing) => {
    let user = typing.user
    if (user.id == "1015653191091761152") {
        let channel = typing.channel
        channel.send(`<@${user.id}> is typing...`)
    }
})


let clientCommands = {
    "say": () => {
        return {
            iExecute: (client, ...args) => {
                client.channels.cache.get(peter).send(args.join(" "))
            }
        }
    },
    "join": () => {
        return {
            iExecute: (client: Client, ...args) => {
                let channel = client.guilds.cache.get(guildId)?.members.cache.get("477590538233708566")?.voice.channelId
                if (channel !== null || channel !== undefined) {
                    joinCall(channel as string)
                }
            },
        }
    }
}

wss.on('connection', ws => {
    Messager.__ws(ws)
    ws.on('message', async data => {
        let payload = data.toString().split(' ')
        console.log(payload)
        let command = payload[0]
        if (command in requiredCommands) {
            requiredCommands[command].iExecute(client, ...payload.slice(1))
        } else if (command in clientCommands) {
            clientCommands[command]().iExecute(client, ...payload.slice(1))
        }
    });
    ws.on('close', () => {
        Messager.__ws(null)
    });
});

client.login(token)