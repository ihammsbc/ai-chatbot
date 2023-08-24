import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import torch
from transformers import AutoModelForQuestionAnswering, AutoTokenizer

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

# Set up flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Load necessary variables on start up
model = AutoModelForQuestionAnswering.from_pretrained("Bert_Test_10Epoch")
tokenizer = AutoTokenizer.from_pretrained("Bert_Test_10Epoch")
context_lines = []
vect = TfidfVectorizer(min_df=1, stop_words='english')

# Build context_lines array on server start up
def build_context():
    with open(r'C:\Repositories\Sandbox\ihamm\ai-chatbot\chatbot-server-py\context\context.txt') as my_file:
        for line in my_file:
            if line != '\n':
                context_lines.append(line)

    print(context_lines)

def get_best_context(question):
    # Fit tfidf similarity array on context lines
    tfidf = vect.fit_transform(context_lines)
    pairwise_similarity = tfidf * tfidf.T
    arr = pairwise_similarity.toarray()
    np.fill_diagonal(arr, np.nan)

    # Get the most likely chunk of context
    input_idx = context_lines.index(question)
    result_index = np.nanargmax(arr[input_idx])

    # Save context from the result index
    context_out = context_lines[result_index]

    # Delete the inserted question from context array
    del context_lines[input_idx]

    return context_out

# Function to clean model response
def clean_answer(answer):
    sentences = answer.split('.')[:-1]
    sentences = [sentence.lstrip().capitalize() for sentence in sentences]
    answer_clean = ". ".join(sentences)
    answer_clean += "."

    return answer_clean

# Prompt fine-tuned model, clean and return the output.
def prompt_model(question):
    context_lines.append(question)
    context = get_best_context(question)
    print("Selected context: \n\n", context )

    inputs = tokenizer(question, context, max_length=512, truncation='only_second', return_tensors='pt')
    with torch.no_grad():
        outputs = model(**inputs)

        answer_start_index = outputs.start_logits.argmax()
        answer_end_index = outputs.end_logits.argmax()

        predict_answer_tokens = inputs.input_ids[0, answer_start_index : answer_end_index + 1]
        answer_raw = tokenizer.decode(predict_answer_tokens)

        print("Answer found: ", answer_raw)

        return clean_answer(answer_raw)

@app.route('/predict', methods=['POST'])
@cross_origin(origins='*', headers=['Content-Type', 'Authorization'])
def predict():
    json_ = request.json
    ai_response = prompt_model(json_['prompt'])
    print(ai_response)
    return jsonify({'answer': ai_response})


if __name__ == '__main__':
    build_context() ## Build context for bert model on start up
    print("Context processed; ready to predict!")
    app.run()