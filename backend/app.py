from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# 🔹 Google OAuth imports
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 ENV VARIABLES
mongo_uri = os.getenv('MONGO_URI')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

if not mongo_uri:
    raise ValueError("MONGO_URI not found in environment variables")

# 🔹 MongoDB connection
client = MongoClient(mongo_uri)
db = client['app']
users = db['users']


# =========================
# 🔹 SIGNUP ROUTE
# =========================
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400

        if users.find_one({'email': email}):
            return jsonify({'error': 'User already exists'}), 400

        users.insert_one({
            'name': name,
            'email': email,
            'password': password
        })

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        print('Signup error:', str(e))
        return jsonify({'error': str(e)}), 500


# =========================
# 🔹 LOGIN ROUTE
# =========================
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        user = users.find_one({'email': email, 'password': password})

        if user:
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print('Login error:', str(e))
        return jsonify({'error': str(e)}), 500


# =========================
# 🔹 GOOGLE LOGIN ROUTE
# =========================
@app.route('/auth/google', methods=['POST'])
def google_login():
    try:
        token = request.json.get('token')

        # Verify token with Google
        idinfo = id_token.verify_oauth2_token(
            token,
            grequests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        name = idinfo.get('name')

        # Check if user exists
        user = users.find_one({'email': email})

        if not user:
            users.insert_one({
                'name': name,
                'email': email,
                'password': None  # No password for Google users
            })

        return jsonify({'success': True, 'email': email}), 200

    except Exception as e:
        print('Google login error:', str(e))
        return jsonify({'error': 'Invalid Google token'}), 401


# =========================
# 🔹 HOME TEST ROUTE
# =========================
@app.route('/')
def home():
    return "Flask Backend Running"


# =========================
# 🔹 RUN APP
# =========================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
