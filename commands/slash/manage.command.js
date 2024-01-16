const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs')
const config = require('../../config/config')
const JSONdb = require('simple-json-db');
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manage')
        .setDescription('管理指令')
        .addSubcommand(subCmd => subCmd
            .setName('forcereset')
            .setDescription('強制清除紀錄'))
        .addSubcommand(subCmd => subCmd
            .setName('allowchannel')
            .setDescription('允許頻道'))
        .addSubcommand(subCmd => subCmd
            .setName('blockchannel')
            .setDescription('禁止頻道')),
    async execute(interaction) {
        if (interaction.user.id !== config.ownerID) return

        let nowAllow = new JSONdb('./allowed_channels.json')
        let nowBlock = new JSONdb('./blocked_channels.json')
        switch (interaction.options.getSubcommand()) {
            case 'forcereset':
                const db = new JSONdb('./history.json')
                db.set(interaction.channel.id, [])

                interaction.reply({ content: '已強制清除紀錄' })
                break;

            case 'allowchannel':

                if (config.mode === 'whitelist') {
                    if (nowAllow.has(interaction.channel.id)) {
                        interaction.reply({ content: '此頻道已經被設為允許', ephemeral: true })
                    } else {
                        nowAllow.set(interaction.channel.id, true)
                        interaction.reply({ content: '已允許此頻道' })
                    }
                }

                if (config.mode === 'blacklist') {
                    if (nowBlock.has(interaction.channel.id)) {
                        nowBlock.delete(interaction.channel.id)
                        interaction.reply({ content: '已允許此頻道' })
                    } else {
                        interaction.reply({ content: '此頻道未被禁止', ephemeral: true })
                    }
                }
                break;

            case 'blockchannel':
                if (config.mode === 'whitelist') {
                    if (nowAllow.has(interaction.channel.id)) {
                        nowAllow.delete(interaction.channel.id)
                        interaction.reply({ content: '已禁止此頻道' })
                    } else {
                        interaction.reply({ content: '此頻道已經被設為禁止', ephemeral: true })
                    }
                }

                if (config.mode === 'blacklist') {
                    if (nowBlock.has(interaction.channel.id)) {
                        interaction.reply({ content: '此頻道已經被設為禁止', ephemeral: true })
                    } else {
                        nowBlock.set(interaction.channel.id, true)
                        interaction.reply({ content: '已禁止此頻道' })
                    }
                }
                break;
        }
    }
}
