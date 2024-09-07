import { Client } from "discord.js"
import { intents } from "./assets/config.json"
import { token } from "./assets/secrets.json"
import { HandleCommands } from "./command-handler"
import { HandleEvents } from "./event-handler"

export const client = new Client({
    intents: intents,
})

async function InitCommands() {
    await HandleCommands(client)
}

async function InitEvents() {
    await HandleEvents(client)
}

client.once("ready", async () => {
    if (client.user === null) return

    await InitCommands()
    await InitEvents()

    console.log(`Logged in as ${client.user.tag}`)
})

client.login(token)
