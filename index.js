const { Telegraf, Markup } = require("telegraf")
const fs = require("fs")
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

// let usersData = require('./test.json')
let usersData = [
  {
    id: 830012205,
    nome: '321',
    cpf: '321',
    perfi: null,
    agendamento: null
  }
]
const sessionData = {}

bot.command("start", (ctx) => {
  ctx.reply(
    // aba de cadastro + login()1. Efetuar cadastro ou login no sistema.
    `
  Olá! Sou o Chico, seu assistente de investimentos. Como posso ajudá-lo hoje?\n\n
  1. Efetuar cadastro no sistema.\n
  2. Definir perfil de investimento.\n
  3. Agendar reunião com um assessor.
  `,
    Markup.inlineKeyboard([
      Markup.button.callback("Cadastro", "option1"),
      Markup.button.callback("Perfil", "option2"),
      Markup.button.callback("Agendamento", "option3"),
    ])
  )
})

bot.action("option1", (ctx) => {
  const userId = ctx.from.id
  sessionData[userId] = { state: "awaitingName" }
  ctx.reply(
    `Certo, vamos dar sequência ao cadastro. Qual é o seu nome completo?`
  )
})

bot.on("text", (ctx) => {
  const userId = ctx.from.id
  const userResponse = ctx.message.text

  if (sessionData[userId].state === "awaitingName") {
    sessionData[userId] = { state: "awaitingCpf", name: userResponse }
    ctx.reply(`Certo, ${userResponse}! Agora informe o seu CPF`)
  } else if (sessionData[userId].state === "awaitingCpf") {
    sessionData[userId].cpf = userResponse

    const finalData = {
      id: userId,
      nome: sessionData[userId].name,
      cpf: sessionData[userId].cpf,
      perfi: null,
      agendamento: null
    }
    usersData = [...usersData, finalData]
    console.log(usersData)
    ctx.reply(`Seu cadastro foi realizado!`)
    fs.writeFile("test.json", JSON.stringify(usersData, null, 2), function (err) {
      if (err) {
        console.log(err)
      }
    })
  }
})

bot.startPolling()
