const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require('../config/config')

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.command.js'))
    const commands = []

    for (const file of commandFiles) {
        const command = require(`../commands/slash/${file}`)
        commands.push(command.data.toJSON())
    }

    const rest = new REST({ version: 9 }).setToken(process.env.BOT_TOKEN)

    rest.put(Routes.applicationCommands(client.user.id), { body: commands })
}