module.exports = {
    timezone: 8, // 控制台輸出時間的時區
    apiKeyCount: 1, // API Key數量
    mode: 'whitelist', // 頻道模式, 黑名單或白名單
    userMode: 'blacklist', // 使用者模式, 黑名單或白名單
    replyMode: 'normal', // 機器人會在什麼情況下做回覆, 一般(normal)(有訊息就回覆)或標註(pinging)(有標註才會回覆)
    allowBOT: true, // 是否允許回覆機器人的訊息
    ownerID: '', // 擁有者ID
    replyWhenResponse: true, // 回應是否使用回覆
    pingWhenReply: true, // 回覆時是否啟用TAG
}