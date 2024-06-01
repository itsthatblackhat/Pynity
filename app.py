from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load universe data from JSON file
with open('levels/universe.json') as f:
    universe_data = json.load(f)

@app.route('/api/universe')
def get_universe():
    return jsonify(universe_data)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
