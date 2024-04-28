import { Telegraf, Scenes, session } from "telegraf"

import dotenv from "dotenv"
import fs from "fs"

import { greetings } from "./gemini.js"
import { appointmentScene } from "./intents/appointment.js"
import { registerScene } from "./intents/register.js"

dotenv.config({ path: "../.env" })

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const stage = new Scenes.Stage([registerScene, appointmentScene])

bot.use(session())

bot.use(stage.middleware())

bot.on("text", async (ctx) => {
  let usersData = JSON.parse(fs.readFileSync("../dados.json", "utf-8"))
  const userId = ctx.from.id
  const userResponse = ctx.message.text
  const response = await greetings(userResponse)
  const currentUser = usersData.find((e) => e.id === userId)

  if (response == "saudação") {
    if (!currentUser) ctx.scene.enter("register_wizard")
    else ctx.reply(`Bem vindo ${currentUser.nome}, gostaria de fazer um agendamento ou definir o perfil de investidor?`)
  }

  if (response == "agendar") {
    ctx.scene.enter("appointment_wizard")
  }
})

// Start the bot
bot.launch()
