
import tempfile
import base64
import json
from io import BytesIO
import io

from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import os
import nltk
from pydub.silence import split_on_silence
from nltk import word_tokenize
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk import pos_tag
from pydub import AudioSegment
from nltk.probability import FreqDist
from textblob import TextBlob
from pprint import pprint
from googletrans import Translator
from wordcloud import WordCloud
from nltk.corpus import stopwords
import matplotlib.pyplot as plt
from transformers import pipeline
from faster_whisper import WhisperModel

model_size = "large-v3"

summarizer = pipeline("summarization")

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('brown')

app = Flask(__name__)
CORS(app)

recognizer = sr.Recognizer()


def transcribe_audio(path):
    # Use the audio file as the audio source
    with sr.AudioFile(path) as source:
        audio_listened = recognizer.record(source)
        # Try converting it to text
        text = recognizer.recognize_google(audio_listened)
    return text


def convert_mp3_to_wav(mp3_file_path):
    print(f"Converting MP3 to WAV: {mp3_file_path}")
    audio = AudioSegment.from_mp3(mp3_file_path)
    wav_file_path = mp3_file_path.replace(".mp3", ".wav")
    audio.export(wav_file_path, format="wav")
    return wav_file_path


def speech_to_text(path_audio):
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    segments, info = model.transcribe(
        path_audio,
        beam_size=5,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
    )

    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
    transcribed_text = ""

    for segment in segments:
        print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
        transcribed_text += segment.text + " "

    print("Transcribed Text:", transcribed_text)
    return transcribed_text

def translate_text(text, target_language='en'):
    translator = Translator()
    translation = translator.translate(text, dest=target_language)
    print(type(translation))
    translated_text = translation.text
    print(type(translated_text))
    return translation.text


def analyze_text(text):
    # try:

    token = nltk.word_tokenize(text)

    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    image_stream = BytesIO()
    wordcloud.to_image().save(image_stream, format='PNG')
    image_base64 = base64.b64encode(image_stream.getvalue()).decode('utf-8')

    filtered_words = [word for word in token if word.lower() not in stopwords.words('english')]
    filter_words = "".join(filtered_words)

    blob = TextBlob(text)
    total_words = len(blob.words)
    total_sentences = len(blob.sentences)

    sentiment = TextBlob(text).sentiment.polarity

    subjectivity = TextBlob(text).sentiment.subjectivity

    fdist = FreqDist(token)
    pos_tags = pos_tag(token)
    noun_length = len([word for word, pos in pos_tags if pos.startswith('N')])
    pronoun_length = len([word for word, pos in pos_tags if pos.startswith('P')])
    verb_length = len([word for word, pos in pos_tags if pos.startswith('V')])
    cardinal_digit_length = len([word for word, pos in pos_tags if pos.startswith('C')])
    sentiment2 = SentimentIntensityAnalyzer()
    sent_1 = sentiment2.polarity_scores(text)
    print(sent_1)
    # sentiment_scores = json.dump(sent_1)

    # summary = summarizer(text, max_length=50, min_length=20, length_penalty=2.0, num_beams=4, early_stopping=True)
    # summarized_text = summary[0]['summary_text']
    # print("sum", summarized_text )

    analysis_result = {
        'words': blob.words,
        'sentences': [str(sentence) for sentence in blob.sentences],
        'tags': blob.tags,
        'noun_phrases': blob.noun_phrases,
        'n_consecutive_words': blob.ngrams(n=3),
        'filtered_words': filtered_words,
        'sentiment': sentiment,
        'subjectivity': subjectivity,
        'frequency_distribution': fdist,
        'pos_tags': pos_tags,
        'Vader_sentiment_analysis': sent_1,
        'image': image_base64,
        'noun_length': noun_length,
        'pronoun_length': pronoun_length,
        'verb_length': verb_length,
        'cardinal_digit_length': cardinal_digit_length,
        'total_words': total_words,
        'total_sentences': total_sentences,
        # 'summarize_text' : summarized_text,

    }
    print("analysis", analysis_result)
    return analysis_result


# except Exception as e:
#     return {'error': str(e)}

# Rest of the code remains unchanged
def save_file(audio_file, destination_path):
    with open(destination_path, 'wb') as destination_file:
        destination_file.write(audio_file.read())
    return destination_path


@app.route('/transcribe', methods=['POST'])
def transcribe_audio_endpoint():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    destination_path = r'C:\Users\SiddhantSinghChouhan\Downloads\LiveAudioScript3.mp3'
    path_audio = save_file(audio_file, destination_path)
    print("Audio file got from frontend", audio_file)
    print("ACtual path audio", path_audio)

    try:
        transcribed_text = speech_to_text(path_audio)
        return jsonify({'transcription': transcribed_text})

    except Exception as e:
        error_message = f"Error during transcription: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500


@app.route('/analyze_text', methods=['POST'])
def analyze_text_endpoint():
    data = request.get_json()
    print(type(data))
    if 'text' not in data:
        return jsonify({'error': 'No text provided for analysis'}), 400

    text_to_analyze = data['text']
    print(type(text_to_analyze))
    analysis_result2 = analyze_text(text_to_analyze)
    print("analysis1", analysis_result2)
    return jsonify(analysis_result2)


@app.route('/summarize_text', methods=['POST'])
def summarize_text_endpoint():
    data = request.get_json()
    if 'text' not in data:
        return jsonify({'error': 'No text provided for summarization'}), 400

    text_to_summarize = data['text']
    max_seq_length = 1024
    if len(text_to_summarize) > max_seq_length:
        text_to_summarize = text_to_summarize[:max_seq_length]
    summary_result = summarizer(text_to_summarize, max_length=500, min_length=100, length_penalty=1.0, num_beams=4,
                                early_stopping=True)
    summarized_text = summary_result[0]['summary_text']

    return jsonify({'summarized_text': summarized_text})

@app.route('/translate_text', methods=['POST'])
def translate_text_endpoint():
    data = request.get_json()
    if 'text' not in data or 'target_language' not in data:
        return jsonify({'error': 'Missing text or target_language in the request'}), 400

    text_to_translate = data['text']
    target_language = data['target_language']
    translated_text = translate_text(text_to_translate, target_language=target_language)

    return jsonify({'translated_text': translated_text})


if __name__ == '__main__':
    app.run(debug=True)
