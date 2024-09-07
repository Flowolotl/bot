import {
    AudioPlayer,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection,
} from "@discordjs/voice"
import { Client } from "discord.js"
import path from "node:path"

export let Connection: VoiceConnection | undefined = undefined
export let Player: AudioPlayer | undefined = undefined

async function checkConnectionAndPlayer() {
    if (Connection !== undefined) {
        Connection.disconnect()
        Connection = undefined
    }
    if (Player !== undefined) {
        Player.stop()
        Player = undefined
    }
}

export async function joinCall(
    channelId: string,
    guildId: string,
    client: Client,
) {
    checkConnectionAndPlayer()
    let audioFile = path.join(__dirname, "assets/audio.mp3")
    let audioResource: AudioResource = createAudioResource(audioFile)
    Player = createAudioPlayer()
    Player.play(audioResource)
    Connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: client.guilds.cache.get(guildId)
            ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        selfDeaf: false,
    })
    let subscription = Connection.subscribe(Player)
    setTimeout(async () => {
        checkConnectionAndPlayer()
        subscription?.unsubscribe()
    }, 3000)
}
