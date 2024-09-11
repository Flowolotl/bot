import { Client } from "discord.js"
import fs from "node:fs"
import path from "node:path"

export async function HandleEvents(client: Client) {
    const eventsPath = path.join(__dirname, "events")
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".ts"))

    let usedEvents = {}
    // eventName: function

    for (const eventFile of eventFiles) {
        const filePath = path.join(eventsPath, eventFile)
        const event = require(filePath)
        if ("events" in event) {
            for (const [func, eventList] of Object.entries(event.events)) {
                // function name, trigger events
                for (const e of eventList as Array<string>) {
                    if (!((e as string) in usedEvents)) {
                        usedEvents[e as string] = []
                    }
                    usedEvents[e as string].push(event[func])
                }
            }
        }
    }
    for (const [event, funcList] of Object.entries(usedEvents)) {
        for (const func of funcList) {
            client.on(event, await func)
        }
    }
}
