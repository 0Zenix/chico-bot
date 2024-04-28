import { Scenes } from "telegraf"
import fs from "fs"
let usersData = JSON.parse(fs.readFileSync("../dados.json", "utf-8"))

export const registerScene = new Scenes.WizardScene(
  "register_wizard",
  async (ctx) => {
    ctx.reply("Bem vindo ao invest-bot, poderia informar o seu nome?")
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.session.name = ctx.message.text
    ctx.reply(`Obrigado, ${ctx.session.name}! agora informe o seu cpf.`)
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.session.cpf = ctx.message.text
    const finalData = {
      id: ctx.from.id,
      nome: ctx.session.name,
      cpf: ctx.session.cpf,
      perfi: null,
      agendamento: null,
    }
    usersData = [...usersData, finalData]
    fs.writeFile("../dados.json", JSON.stringify(usersData, null, 2), function (err) {
      if (err) {
        console.log(err)
      }
    })
    ctx.reply(`Seu cadastro foi realizado!`)

    return ctx.scene.leave()
  }
)
