import fs from 'node:fs'
import path from 'node:path'

const nicksFilePath = path.join(__dirname, 'nicks.json');

export function checkAndSetNickname(member) {
    let nicksData;
    try {
        nicksData = JSON.parse(fs.readFileSync(nicksFilePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading nicks file: ${error}`);
        return;
    }
    const newNickname = nicksData[member.user.id];
    if (newNickname) {
        if (member.nickname !== newNickname) {
            member.setNickname(newNickname)
            .then(console.log(`${new Date().getUTCDate()}-${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} Successfully changed nickname to ${newNickname}`))
            .catch()
        }
    }
}