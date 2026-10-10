"""
================================================================================
          JARVIS DESKTOP VOICE ASSISTANT - PYTHON VS CODE EDITION
================================================================================
Created for: Lisara Kodikara (jdushi@gmail.com) / Tony Stark
Repository: https://github.com/dushi2933/DUS-JARVIS
Compilation Environment: Visual Studio Code Editor (Python 3.10+)
Required Packages:
    pip install pyttsx3 speechrecognition wikipedia pyaudio
Compile to standalone Windows .exe:
    pip install pyinstaller
    pyinstaller --onefile --windowed jarvis_desktop_assistant.py
================================================================================
"""

import pyttsx3
import speech_recognition as sr
import datetime
import wikipedia
import webbrowser
import os
import sys

try:
    engine = pyttsx3.init('sapi5')
    voices = engine.getProperty('voices')
    if voices:
        engine.setProperty('voice', voices[0].id)
    engine.setProperty('rate', 190)
except Exception:
    engine = None

def speak(audio):
    print(f"J.A.R.V.I.S.: {audio}")
    if engine:
        try:
            engine.say(audio)
            engine.runAndWait()
        except Exception:
            pass

def wishMe():
    hour = int(datetime.datetime.now().hour)
    if hour >= 0 and hour < 12:
        speak("Good Morning, Mr. Stark!")
    elif hour >= 12 and hour < 18:
        speak("Good Afternoon, Sir!")
    else:
        speak("Good Evening, Sir!")
    speak("Jarvis Desktop Voice Assistant online. How may I assist you?")

def takeCommand():
    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("\n[LISTENING...] Speak into your microphone...")
            r.pause_threshold = 1.0
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source, timeout=6)
    except Exception as e:
        # Fallback to console input if microphone unavailable
        print("\n[VOICE INPUT] Microphone not detected or timed out. Type directive:")
        cmd = input("Directive: ")
        return cmd

    try:
        print("[RECOGNIZING...] Processing neural voice patterns...")
        query = r.recognize_google(audio, language='en-in')
        print(f"User Directive: {query}\n")
    except Exception as e:
        print("Say that again please, Sir...")
        return "None"
    return query

if __name__ == "__main__":
    wishMe()
    while True:
        raw_cmd = takeCommand()
        if not raw_cmd:
            continue
        query = raw_cmd.lower().strip()

        if 'wikipedia' in query:
            speak('Searching Wikipedia database, Sir...')
            query = query.replace("wikipedia", "").replace("search", "").replace("for", "").strip()
            try:
                results = wikipedia.summary(query, sentences=3)
                speak("According to Wikipedia:")
                print(results)
                speak(results)
            except Exception as e:
                speak("I apologize, Sir. No matching Wikipedia record was found.")

        elif 'open youtube' in query:
            speak("Opening YouTube, Sir.")
            webbrowser.open("https://www.youtube.com")

        elif 'open google' in query:
            speak("Opening Google search engine, Sir.")
            webbrowser.open("https://www.google.com")

        elif 'open github' in query:
            speak("Opening your DUS-JARVIS GitHub repository, Sir.")
            webbrowser.open("https://github.com/dushi2933/DUS-JARVIS")

        elif 'the time' in query:
            strTime = datetime.datetime.now().strftime("%H:%M:%S")
            speak(f"Sir, the current time is {strTime}")

        elif 'the date' in query or 'today' in query:
            strDate = datetime.datetime.now().strftime("%A, %B %d, %Y")
            speak(f"Sir, today is {strDate}")

        elif 'play music' in query:
            speak("Playing music on soundstage, Sir.")
            webbrowser.open("https://www.youtube.com/results?search_query=ac+dc+back+in+black")

        elif 'quit' in query or 'exit' in query:
            speak("Powering down Jarvis. Have a splendid day, Mr. Stark.")
            sys.exit(0)
