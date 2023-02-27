const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("askgpt")
        .addStringOption(option =>
            option.setName('pergunta')
                .setDescription('O que você deseja saber?')
                .setRequired(true))
        .setDescription("Responde com Pong!"),

    async execute(interaction) {
        let gptResponse = "";
        // await interaction.deferReply({ ephemeral: false });
        await axios.post('https://api.openai.com/v1/completions', 
        {'model': 'text-davinci-003','prompt': interaction.options.getString("pergunta"),'temperature': 0,'max_tokens': 200}, 
        {headers:{ 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TOKEN_AI}` }})
            .then(async (data)=>{
                // console.log(data.data);
                gptResponse = data.data.choices[0].text;
                
            })
            
            await interaction.reply(gptResponse);
        
    }
};

