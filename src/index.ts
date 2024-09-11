import { Client } from "discord.js"
import { intents } from "./assets/config.json"
import { token } from "./assets/secrets.json"
import { HandleEvents } from "./event-handler"

export const client = new Client({
    intents: intents,
})

async function InitEvents() {
    await HandleEvents(client)
}

InitEvents()

client.login(token)
