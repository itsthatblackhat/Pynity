import threading
import subprocess
from flask import Flask, render_template, jsonify, send_from_directory
import json
import os

app = Flask(__name__)

# Load universe data from JSON file
with open('levels/universe.json') as f:
    universe_data = json.load(f)

# Load configuration data
with open('levels/universe.config') as f:
    config_data = json.load(f)

@app.route('/api/universe')
def get_universe():
    return jsonify(universe_data)

@app.route('/api/config')
def get_config():
    return jsonify(config_data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/levels/<filename>')
def get_level_file(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'levels'), filename)

def start_flask():
    app.run(port=5000)  # Ensure the port is set correctly and matches with the fetch call

def open_editor():
    editor_executable = os.path.join("PynityEditor", "dist", "PynityEditor.exe")
    if os.path.exists(editor_executable):
        try:
            subprocess.Popen([editor_executable])
            print("Editor launched successfully.")
        except FileNotFoundError:
            print("Error: Editor executable not found. Please ensure it is packaged correctly.")
    else:
        print(f"Error: The executable {editor_executable} does not exist.")

def cli():
    print("""
    ************
    *  Pynity!  *
    ************
    1. Launch Pynity Editor 
    2. Clean shutdown Pynity Engine
    ----------------------------------------
    Note: or do nothing and leave open
    ----------------------------------------
    """)
    while True:
        choice = input("Pynity:> ").strip()
        if choice == '1':
            open_editor()
        elif choice == '2':
            print("Shutting down Pynity Engine...")
            exit(0)

if __name__ == '__main__':
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    cli()
