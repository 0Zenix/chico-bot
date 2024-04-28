import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dayjs from "dayjs"

dotenv.config({ path: "../.env" })

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY)

export async function greetings(input) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  const options = `"agendar", "saudação", "perfil", "cadastro", "duvidas", "conhecer"`

  // const prePrompt =
  //   "você é um chatbot de investimentos chamado invest-bot, responda esse prompt apenas com uma curta saudação se apresentando de acordo: "
  const prePrompt = `a partir deste texto " ${input} " e baseado nas seguintes intenções ${options}, escolha a opção correta. responda apenas com uma das opções ${options}, caso nenhuma se encaixe responda apenas com desconhecido. Não modifique a opção e remova as aspas`
  const result = await model.generateContent(prePrompt + " " + input)
  const response = await result.response
  const text = response.text()
  return text
}

export async function getDate(input) {
  const day = dayjs().format("DD/MM/YYYY")
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  // const prompt = `responda apenas com uma data no formato DD/MM/YYYY, sabendo que hoje é dia ${day} dia da semana sabado calcule a data a partir do input: ${input}`
  // const prompt = `hoje é um sabado, dia ${day}, sabendo disso calcule a proxima data a partir desse input "${input}. responda apenas e apenas com a data no formato DD/MM/YYYY, caso você não consiga calcular uma data com as informações retorn apenas "inconclusivel". Se esforce para nao errar, erros são imperdoaveis o futuro da raça humana e minha nota está em jogo`
  const prompt = `sabendo que hoje é sabado dia ${day} responda no formato "DD/MM/YYYY" a proxima data referente a pergunta: ${input}. se não for possivel definir uma data a partir do ${input} responda apenas "inv", por favor refaça o calculo multiplas vezes, você não pode errar`
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  // return text
  return text
}
