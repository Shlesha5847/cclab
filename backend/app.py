from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Get MongoDB connection string from environment variables
mongo_uri = os.getenv('MONGO_URI')
if not mongo_uri:
    raise ValueError("MONGO_URI not found in environment variables")

# Connect to MongoDB Atlas
client = MongoClient(mongo_uri)

# Select database (you can also set this in .env)
db = client['app']

# Select collection
users = db['users']

@app.route('/signup', methods=['POST'])
def signup():
    """
    Handle user signup.
    Expects JSON with name, email, password.
    """
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')  # Note: In production, hash the password

        # Validate input
        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400

        # Check if user already exists
        if users.find_one({'email': email}):
            return jsonify({'error': 'User with this email already exists'}), 400

        # Insert new user
        users.insert_one({'name': name, 'email': email, 'password': password})
        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        print('Signup error:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """
    Handle user login.
    Expects JSON with email, password.
    """
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Check credentials
        user = users.find_one({'email': email, 'password': password})
        if user:
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        print('Login error:', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=True)