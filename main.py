import openai
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

openai.api_key = "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"

def query_codex(prompt):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5,
    )
    message = response.choices[0].text.strip()
    return message

@app.route('/process_query', methods=['POST'])
def process_query():
    data = request.get_json()
    prompt = data['prompt']

    excel_data = pd.read_excel("Montagens.xlsx")
    prompt_with_data = f"{prompt}\n\n{excel_data.to_markdown()}\n"
    response = query_codex(prompt_with_data)

    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(debug=True)
