from flask import Flask, request, render_template, jsonify
import pandas as pd
import mysql.connector
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
from nltk.tokenize import word_tokenize
import nltk
import threading
import webbrowser

nltk.download('punkt')

app = Flask(__name__)

# Load SBERT model
print("Loading Sentence-BERT model...")
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

# File path to dataset
file_path = r"model train.xlsx" 
data = pd.read_excel(file_path)

# Preprocess and prepare embeddings
def preprocess_text(text):
    if not isinstance(text, str):
        text = ""
    text = text.lower()  
    text = re.sub(r'[^a-z\s]', '', text) 
    tokens = word_tokenize(text) 
    return ' '.join(tokens)

data['combined_text'] = data['SectionDescription'].fillna('') + " " + data['Illustrations'].fillna('')
data['cleaned_combined_text'] = data['combined_text'].apply(preprocess_text)
data['embeddings'] = data['cleaned_combined_text'].apply(lambda x: sbert_model.encode(x))

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Mahi@00007', 
    'database': 'legal_sections'  
}

# Function to find relevant sections
def get_relevant_sections(user_input, data, sbert_model, top_n=5, similarity_threshold=0.2):
    cleaned_input = preprocess_text(user_input)
    input_embedding = sbert_model.encode(cleaned_input)
    similarities = data['embeddings'].apply(lambda x: cosine_similarity([input_embedding], [x]).flatten()[0])
    data['similarity_score'] = similarities
    relevant_data = data[data['similarity_score'] >= similarity_threshold]
    relevant_data = relevant_data.sort_values(by='similarity_score', ascending=False).head(top_n)
    return relevant_data[['SectionNumber', 'similarity_score']]

# Function to fetch additional details from MySQL
def fetch_remaining_columns(section_numbers):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    format_strings = ', '.join(['%s'] * len(section_numbers))
    query = f"""
    SELECT SectionNumber, SectionTitle, SectionDescription, Illustrations, BailableOrNot, Fine, Punishment 
    FROM legalsections
    WHERE SectionNumber IN ({format_strings})
    """
    cursor.execute(query, section_numbers)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return results

# Flask routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_relevant_sections', methods=['POST'])
def get_sections():
    user_input = request.form['user_input']
    # Process the input and fetch relevant IPC sections
    top_results = get_relevant_sections(user_input, data, sbert_model, top_n=5, similarity_threshold=0.3)

    if not top_results.empty:
        section_numbers = top_results['SectionNumber'].tolist()
        results = fetch_remaining_columns(section_numbers)
        return jsonify(results)  # Send JSON response to frontend
    else:
        return jsonify({'message': 'No relevant sections found.'})

# Define the function before using it
def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

# Run Flask app
if __name__ == '__main__':
    timer = threading.Timer(1.5, open_browser)
    timer.start()
    app.run(host="0.0.0.0", port=7860, debug=True, use_reloader=False)