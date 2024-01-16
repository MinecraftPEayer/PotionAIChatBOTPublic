module.exports = async (chat, message) => {
    const result = await chat.sendMessage(message)
    const response = await result.response
    const reply = response.text()
    return reply;
}