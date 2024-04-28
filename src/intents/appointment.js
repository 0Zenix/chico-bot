import { Scenes } from "telegraf"
import fs from "fs"
import { getDate } from "../gemini.js"
let usersData = JSON.parse(fs.readFileSync("../dados.json", "utf-8"))

export const appointmentScene = new Scenes.WizardScene(
  "appointment_wizard",
  async (ctx) => {
    const user = usersData.find((e) => e.id === ctx.from.id)
    //TODO oferecer cancelar agendamento se caso usuario ja possua um?

    if (user.agendamento !== null) {
      ctx.reply(`Verificamos que você já possui um agendamento para o dia ${user.agendamento} `)
    }

    ctx.reply("Certo, vamos dar sequencia ao agendamento, para que dia gostaria de agendar?")
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.session.data = ctx.message.text
    const dataAgendamento = await getDate(ctx.message.text)

    if (dataAgendamento.toLocaleLowerCase() === "inv") {
      ctx.reply("Não compreendi a data, poderia informar novamente?")
      return ctx.wizard.selectStep(1)
    }

    usersData.map((person) => {
      if (person.id === ctx.from.id) {
        return { ...person, agendamento: dataAgendamento }
      } else {
        return person
      }
    })
    fs.writeFile("dados.json", JSON.stringify(usersData, null, 2), function (err) {
      if (err) {
        console.log(err)
      }
    })
    ctx.reply(`Seu agendamento foi marcado para o dia ${dataAgendamento}`)
    return ctx.scene.leave()
  }
)
