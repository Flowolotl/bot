import WebSocket from 'ws'
import { port } from '../config.json'

const ws = new WebSocket(`ws://localhost:${port}`)


ws.on('open', () => {
    ws.send("join")
    ws.close()
})


