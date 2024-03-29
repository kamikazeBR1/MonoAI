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
    const initialPrompt = "Uma conversa com um analista de dados experiente que gosta de ajudar sempre com respostas precisas e corretas. \nHuman:"
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `${initialPrompt} ${prompt}`,
      temperature: 0.1, // Higher values means the model will take more risks.
      max_tokens: 1000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 0.9, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 1, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Alguma coisa deu errada...');
  }
})

app.listen(5000, () => console.log('MonoAI iniciada em: http://localhost:5000'))