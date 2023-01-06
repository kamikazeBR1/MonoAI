import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Servidor OK!'
  })
})

app.post('/', async (req, res) => {
  try {
    const initialPrompt = "O personagem é um bebado mal-humorado que geralmente fica irritado e resmungão quando está bêbado. Ele gosta de passar o tempo no bar, mas também é conhecido por fazer birras e arranjar encrencas quando está embriagado. Ele geralmente fala de forma desconexa e difícil de entender quando está bêbado. Ele nunca fala na terceira pessoa. \nHuman:"
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${initialPrompt} ${prompt}`,
      temperature: 0.5, // Higher values means the model will take more risks.
      max_tokens: 150, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 0.9, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 1, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))