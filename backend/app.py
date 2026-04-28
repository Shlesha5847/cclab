from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# 🔹 Google OAuth imports
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

# 🔹 JWT imports
import jwt
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 ENV VARIABLES
mongo_uri = os.getenv('MONGO_URI')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
SECRET_KEY = os.getenv('SECRET_KEY', 'secret')

if not mongo_uri:
    raise ValueError("MONGO_URI not found in environment variables")

# 🔹 MongoDB connection
client = MongoClient(mongo_uri)
db = client['app']
users = db['users']


# =========================
# 🔹 HELPER: CREATE TOKEN
# =========================
def create_token(email):
    return jwt.encode({
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm='HS256')


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
# 🔹 LOGIN ROUTE (JWT ADDED)
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
            token = create_token(email)
            return jsonify({'token': token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print('Login error:', str(e))
        return jsonify({'error': str(e)}), 500


# =========================
# 🔹 GOOGLE LOGIN ROUTE (JWT ADDED)
# =========================
@app.route('/auth/google', methods=['POST'])
def google_login():
    try:
        token = request.json.get('token')

        idinfo = id_token.verify_oauth2_token(
            token,
            grequests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        name = idinfo.get('name')

        user = users.find_one({'email': email})

        if not user:
            users.insert_one({
                'name': name,
                'email': email,
                'password': None
            })

        jwt_token = create_token(email)

        return jsonify({'token': jwt_token}), 200

    except Exception as e:
        print('Google login error:', str(e))
        return jsonify({'error': 'Invalid Google token'}), 401


# =========================
# 🔹 PROTECTED ROUTE (TEST SSO)
# =========================
@app.route('/profile', methods=['GET'])
def profile():
    try:
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({'error': 'Token missing'}), 401

        token = auth_header.split(" ")[1]

        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        user = users.find_one({'email': decoded['email']}, {'_id': 0})

        return jsonify({'user': user}), 200

    except Exception as e:
        return jsonify({'error': 'Invalid or expired token'}), 401


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
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
