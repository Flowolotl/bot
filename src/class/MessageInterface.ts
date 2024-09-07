import { CommandInteraction } from "discord.js";

class MessageInterface {
    private static instance: MessageInterface;
    private constructor() {}
    private static ws: WebSocket

    public static getInstance() {
        if (!MessageInterface.instance) {
            MessageInterface.instance = new MessageInterface();
        }
        return MessageInterface.instance;
    }
    private say(payload: string | { content: string, ephemeral: boolean }, interaction?: CommandInteraction) {
        let cargo: string | { content: string, ephemeral: boolean, type?: string } = ""
        let send = (message) => {}
        if (!interaction) {
            if (typeof payload === 'object') {
                if (payload.content) {
                    if (payload.ephemeral) {
                        cargo = JSON.stringify(payload)
                        if (MessageInterface.ws) {
                            send = (message) => MessageInterface.ws.send(message)
                        }
                    } else {
                        cargo = payload.content
                        send = (message) => console.log(message)
                    }
                }
            }
        } else {
            cargo = payload
            send = (message) => interaction.reply(message)
        }

        send(cargo)
    }
    public ok(payload: string | { content: string, ephemeral: boolean, type?: string }, interaction?: CommandInteraction) {
        if (!interaction && typeof payload === 'object') {
            payload.type = 'ok'
        }
        this.say(payload, interaction)
    }
    public err(payload: string | { content: string, ephemeral: boolean, type?: string }, interaction?: CommandInteraction) {
        if (!interaction && typeof payload === 'object') {
            payload.type = 'err'
        }
        this.say(payload, interaction)
    }
    public __ws(ws: WebSocket | any) {
        MessageInterface.ws = ws
    }
}

export default MessageInterface;