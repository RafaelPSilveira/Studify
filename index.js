// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;

//Command import
const fs = require("node:fs");
const path = require("node:path");

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandsFiles) {

    const filePath = path.join(commandsPath, file)
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`This command in ${filePath} is missing "data" or "execute"`);
    }
};


// Log in to Discord with your client's token
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

//Listener of interactions with the bot
client.on(Events.InteractionCreate, async interacation => {
    if (interacation.isStringSelectMenu()){
        const selected = interacation.values[0];
        switch(selected){
            case 'javascript':
                await interacation.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript")
                break;  

            case 'php':
                await interacation.reply("Documentação do PHP: https://www.php.net/")
                break; 

            case 'laravel':
                await interacation.reply("Documentação do Laravel: https://laravel.com")
            break;

            case 'discordjs':
                await interacation.reply("Documentação do discord.js: https://discord.js.org/#/")
            break;

            case 'vuejs':
                await interacation.reply("Documentação do Vue.js: https://vuejs.org/")
            break;   
        }
    };
    
    if (!interacation.isChatInputCommand()) return
    const command = interacation.client.commands.get(interacation.commandName);
    if (!command) {
        console.error("Comando não encontrado");
        return
    }
    try {
        await command.execute(interacation);
    } catch (error) {
        console.error(error);
        // await interacation.reply("Houve um erro ao executar este comando!");
    }
});