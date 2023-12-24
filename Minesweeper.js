const { Client, Intents } = require('discord.js-selfbot-v13');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    checkUpdate: false,
});

const minesweeperEmoji = '||:boom:||';
const emptyCellEmoji = '||:white_large_square:||'; 
const gridSize = 4; 
let minesweeperMessage = null;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '!mines') {
        const minesweeperGrid = generateMinesweeperGrid(gridSize);
        const formattedGrid = formatGrid(minesweeperGrid);
        if (minesweeperMessage) {
            minesweeperMessage.edit(formattedGrid);
        } else {
            minesweeperMessage = await message.channel.send(formattedGrid);
        }
    }
});

function generateMinesweeperGrid(size) {
    const grid = [];
    for (let i = 0; i < size; i++) {
        grid.push([]);
        for (let j = 0; j < size; j++) {
            grid[i].push(Math.random() < 0.25 ? minesweeperEmoji : emptyCellEmoji);
        }
    }
    return grid;
}

function formatGrid(grid) {
    return grid.map(row => row.join('')).join('\n');
}

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.id === client.user.id) return; 
    if (!minesweeperMessage || reaction.message.id !== minesweeperMessage.id) return;

    const clickedEmoji = reaction.emoji.toString();
    if (clickedEmoji === minesweeperEmoji) {
        minesweeperMessage.edit('You clicked a bomb! Game Over!');
        minesweeperMessage = null; 
    }
});



client.login('UrToken');
