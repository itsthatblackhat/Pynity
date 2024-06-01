from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

# Load universe data from JSON file
with open(os.path.join('levels', 'universe.json')) as f:
    universe_data = json.load(f)

# Load configuration data from JSON file
config_path = os.path.join('levels', 'universe.config')
with open(config_path) as f:
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

if __name__ == '__main__':
    app.run(debug=True)
