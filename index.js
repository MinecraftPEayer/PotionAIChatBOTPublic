require('./lib/init') // 初始化

const Discord = require('discord.js')
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai')
const Chat = require('./lib/chat.js')
const JSONdb = require('simple-json-db')
const config = require('./config/config.js')
require('dotenv').config()


let keyIndex = 0
function renewAPIKey(index) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY.split(', ')[index])
    return genAI
}

const client = new Discord.Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent'
    ]
})

client.commands = new Discord.Collection()
require('./lib/loadCommand.js')(client)

client.on('ready', () => {
    require('./lib/registerCommand.js')(client)
    console.log(`完成! 現在已登入 ${client.user.tag}`)
})

client.on('messageCreate', async (message) => {
    // 允許/禁止機器人
    if (!config.allowBOT && message.author.bot) return;
    
    // 避免機器人回覆自己訊息而進入死循環
    if (message.author.id === client.user.id) return;
    
    // 檢測回覆模式是否為標註並檢查是否標註機器人
    if (config.replyMode === 'pinging' && message.mentions.users.toJSON().filter(user => user.id === client.user.id).length === 0) return;

    // 允許/禁止使用者
    const allowedUsers = new JSONdb('./allowed_users.json')
    const blockedUsers = new JSONdb('./blocked_users.json')
    if (config.userMode === 'whitelist' && !allowedUsers.has(message.author.id)) return;
    if (config.userMode === 'blacklist' && blockedUsers.has(message.author.id)) return;
    
    // 允許/禁止頻道
    const allowedChannels = new JSONdb('./allowed_channels.json')
    const blockedChannels = new JSONdb('./blocked_channels.json')
    if (config.mode === 'whitelist' && !allowedChannels.has(message.channel.id)) return;
    if (config.mode === 'blacklist' && blockedChannels.has(message.channel.id)) return;

    // 讀取對話歷史
    const history = new JSONdb('./history.json')
    if (!history.has(message.channel.id)) history.set(message.channel.id, [])
    let thisChannelHistory = history.get(message.channel.id).length !== 0 ? history.get(message.channel.id) : require('./default_history.json');
    
    // 若上次對話模型沒有回覆訊息，就先將上次模型說的話設為空白
    if (thisChannelHistory[thisChannelHistory.length - 1].role && thisChannelHistory[thisChannelHistory.length - 1].parts) {
        if (thisChannelHistory[thisChannelHistory.length - 1].role === 'user') thisChannelHistory.push({ role: 'model', parts: ''})
    }

    // 刷新API Key
    const genAI = renewAPIKey(keyIndex)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // 建立聊天
    const chat = model.startChat({
        history: thisChannelHistory,
        generationConfig: {
            maxOutputTokens: 100,
            topK: 1,
            topP: 1,
            temperature: 0.9
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
        ]
    })

    // 將使用者說的話存入對話歷史中
    const content = message.content;
    thisChannelHistory.push({ role: 'user', parts: `[${message.author.username}] ${content}` })
    history.set(message.channel.id, thisChannelHistory)

    // 發送訊息
    message.channel.sendTyping()
    const reply = await Chat(chat, `[${message.author.username}] ${content}`);

    // 若回應為空
    if (reply === '') return

    // 回覆訊息
    if (config.replyWhenResponse) {
        message.reply({ content: reply, allowedMentions: { parse: [], repliedUser: config.pingWhenReply } })
    } else {
        message.channel.send({ content: reply })
    }

    // 將模型返回的訊息存入對話歷史中
    thisChannelHistory.push({ role: 'model', parts: reply })
    history.set(message.channel.id, thisChannelHistory)
    
    // 切換API Key
    keyIndex++
    if (keyIndex === config.apiKeyCount) keyIndex = 0;
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.type === Discord.InteractionType.ApplicationCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return

    try {
        command.execute(interaction)
    } catch (error) {
        console.error(error)
    }
})

client.login(process.env.BOT_TOKEN)