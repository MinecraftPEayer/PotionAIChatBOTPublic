const fs = require('fs')

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./commands/slash/').filter(file => file.endsWith('.command.js'))

    for (const file of commandFiles) {
        const command = require(`../commands/slash/${file}`)

        client.commands.set(command.data.name, command)
    }
}