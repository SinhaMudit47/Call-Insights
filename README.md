# Call-Insights

# Speech-to-Text Program

## Overview
This Python program converts spoken words into text using the Speech Recognition library. It's a simple and easy-to-use tool for transcribing spoken language into written text.

## Prerequisites
Before running the program, ensure that you have the following installed:

1. **Python:** Download and install Python from [python.org](https://www.python.org/downloads/).
   - Make sure to check the option to add Python to your system PATH during installation.
   - Use Python verion 3.10 .

2. **PyCharm (Optional):** You can use any code editor, but PyCharm is recommended for a smoother development experience. Download PyCharm from [jetbrains.com/pycharm/download/](https://www.jetbrains.com/pycharm/download/).

## Setup
1. **Install Speech Recognition Library:**
   - Open a terminal or command prompt.
   - Run the following command to install the Speech Recognition library:
     ```bash
     pip install SpeechRecognition
     ```
Add additional dependencies

     pip install pydub
     # Needed to import and manipulate audio files with Python
     pip install Flask
     # Used for building API's and Web-Applicatinons in Python
     pip install Flask-Cors
     #  Allows you to support cross origin resource sharing (CORS) using a simple decorator
     pip install google-cloud-speech
     # Enables easy integration of Google text recognition technologies
     pip install googletrans
     # Used for translation of text
     pip install wordcloud
     # Used to demonstrate text in Cloud like format
     pip install spacy
     # Used for text summarization
     pip install tensorflow
     # Used for Natural Language Processing Tasks
     pip install textblob
     # Used for getting Subjectivity in a text
     pip install vader-sentiment
     # Used for getting Sentiment Analysis of Text
     pip install transformers
     # Provides OpenAI models and pipelines for getting summarization and other tasks 
     pip install tokenizers
     # Used for creating tokens
     pip install nltk
     # Provides different functions for Natual Language Processing 
     pip install faster-whisper
     # Implementation of OpenAI Whisper Model to accurately convert audio into text

## If Google Translate not working or showing error
Then open terminal and type pip install googletrans==4.0.0-rc1

## To install all these dependencies in PyCharm-:
     Go to Files->Settings->Project-Python Interpreter->Click on + button->Install by giving the name directly



##Downloads required from External Sources(ffmpeg)
     Download ffmpeg 6.1.1 Windows 64 bit from here [https://www.videohelp.com/software/ffmpeg]
     Steps to add it into the path-> 
     Move the ffpmeg folder into C-Drive->Copy Bin Path ‪[C:\ffmpeg-6.1.1-full_build\bin]-> Add into environment variables
     Add this line into your python code-> os.environ["PATH"] += os.pathsep + r'C:\ffmpeg-6.1.1-full_build\bin

2. **Run the Program:**
   - Open the program file in PyCharm or your preferred code editor.
   - Run the program.

##If your model is taking a lot of time, then you can change model type from large to medium
[model_size = "large-v3"], here instead of large-v3 you can write [model_size = "medium"] and your model will work faster

## Usage
1. When the program is executed, it will upload the audio file.
2. The program will transcribe the audio and display the text on the screen.

## Notes
- Make sure your computer has a working microphone.
- Internet connectivity is required for using the Speech Recognition library.

## Troubleshooting
- If you encounter issues with the Speech Recognition library, check the documentation [here](https://pypi.org/project/SpeechRecognition/).

## Author
[Mudit Sinha]

Feel free to reach out for any questions or issues!
