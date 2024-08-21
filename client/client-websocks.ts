import WebSocket from 'ws';
import { port } from '../config.json';
import * as readline from 'readline';
import { commands } from './commands';

const ws = new WebSocket(`ws://localhost:${port}`);
// @ts-ignore
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const commandImpls = {
    "exit": () => {
        ws.close();
        rl.close();
        process.exit(0);
    },
    "clear": () => {
        // @ts-ignore
        readline.moveCursor(process.stdout, -100, -100);
        // @ts-ignore
        readline.clearScreenDown(process.stdout);
    },
    "say": (...args) => {
        ws.send(`say ${args.join(" ")}`);
    },
    "help": () => {
        console.log(commands);
    },
    "nick": (user, nick) => {
        if (nick) {
            ws.send(`nick ${user} ${nick}`);
        } else {
            console.log("No nickname given");
        }
    },
    "role": (user, role) => {
        if (role) {
            ws.send(`role ${user} ${role}`);
        } else {
            console.log("No role given");
        }
    }
}

ws.on('open', () => {
    console.log('WebSocket connected');
    const promptUser = () => {
        rl.question('> ', (message) => {
            const [command, ...args] = message.split(' ');
            if (command in commands && command in commandImpls) {
                commandImpls[command](...args);
            }

            promptUser();
        });
    };

    promptUser();
});

function info(payload) {
    // @ts-ignore
    readline.cursorTo(process.stdout, 0);
    console.log(`${payload.type}: ${payload.content}`);
    process.stdout.write(`> `);
} 

ws.on('message', data => {
    let payload = JSON.parse(data.toString())
    if (payload.content) {
        info(payload)
    }
});

ws.on('close', () => {
    console.log('WebSocket closed');
    rl.close();
});

ws.on('error', error => {
    console.error(error);
});
