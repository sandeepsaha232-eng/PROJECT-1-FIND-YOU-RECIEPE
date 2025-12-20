# --- COMPATIBILITY PATCH FOR PYTHON 3.9 ---
import os
from dotenv import load_dotenv
load_dotenv()

import sys
if sys.version_info < (3, 10):
    try:
        import importlib_metadata
        import importlib.metadata
        # Teach older Python where to find the missing function
        importlib.metadata.packages_distributions = importlib_metadata.packages_distributions
    except ImportError:
        pass
# ------------------------------------------

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import google.generativeai as genai
from PIL import Image
import io
from pytrends.request import TrendReq
import random
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True) # supports_credentials essential for session cookies with CORS

# Load secrets from the .env file
# Get the key securely
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    # Fallback/Debug print if needed, or just raise error
    print("Warning: GOOGLE_API_KEY not found in .env file.")
    # raise ValueError("No API Key found. Please check your .env file.") 
    # (Commenting out raise to avoid crashing if user hasn't set it perfectly yet, 
    # but based on instructions I should probably raise it. User code had raise.)

if not api_key:
     raise ValueError("No API Key found. Please check your .env file.")

genai.configure(api_key=api_key)
# Set up the model
# Updated to match your 2025 available models
model = genai.GenerativeModel('gemini-2.5-flash')
# import os (Moved to top)

# ...

# --- CONFIGURATION ---
app.config['SECRET_KEY'] = 'mysecretkey'
# Move DB out of project folder to prevent Live Server auto-reload loops
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.expanduser('~'), 'hostel_chef_db.sqlite')
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True  # Required if SameSite=None

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({'error': 'Unauthorized', 'message': 'Please log in to access this resource'}), 401

# --- LOGIN MANAGER CALLBACK ---
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# --- DATABASE MODEL ---
class User(UserMixin, db.Model): # UserMixin adds detail for Flask-Login
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_name = db.Column(db.String(200), nullable=False)
    recipe_steps = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --- ROUTES ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
        
    user_name = data.get('username')
    user_password = data.get('password')

    if not user_name or not user_password:
        return jsonify({'error': 'Missing username or password'}), 400

    existing_user = User.query.filter_by(username=user_name).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(user_password).decode('utf-8')
    new_user = User(username=user_name, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Account created successfully!'}), 201

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# ... (Previous imports)

# Google Client ID
GOOGLE_CLIENT_ID = "939304319890-lb1l18akm1ji2a5padq7kleosaq6civn.apps.googleusercontent.com"

@app.route('/google_login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Missing token'}), 400

    try:
        # Verify the token
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account information from the decoded token.
        email = id_info['email']
        name = id_info.get('name', '')
        
        # Check if user exists
        user = User.query.filter_by(username=email).first()
        
        if not user:
            # Create a new user for Google login
            # We use a random password since they login via Google
            random_password = bcrypt.generate_password_hash(str(random.getrandbits(128))).decode('utf-8')
            user = User(username=email, password=random_password)
            db.session.add(user)
            db.session.commit()
            
        # Log the user in
        login_user(user)
        return jsonify({'message': 'Login successful', 'username': user.username}), 200

    except ValueError as e:
        # Invalid token
        return jsonify({'error': f'Invalid token: {str(e)}'}), 401
    except Exception as e:
        print(f"Google Login Error: {e}")
        return jsonify({'error': 'Google authentication failed'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    user_name = data.get('username')
    user_password = data.get('password')

    user = User.query.filter_by(username=user_name).first()

    if user and bcrypt.check_password_hash(user.password, user_password):
        login_user(user) # Logs the user in and creates session
        return jsonify({'message': 'Login successful!', 'username': user.username}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user() # Clears session
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/status', methods=['GET'])
def status():
    if current_user.is_authenticated:
        return jsonify({'logged_in': True, 'username': current_user.username}), 200
    else:
        return jsonify({'logged_in': False}), 200

# --- THE RECIPE SUGGESTION ROUTE ---
@app.route('/suggest', methods=['POST'])
@login_required 
def suggest_recipe():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            # 1. Convert the uploaded file to an Image format Gemini can understand
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))

            # 2. The Prompt for the AI
            prompt = (
                "You are a helpful cooking assistant for a college student living in a hostel. "
                "Analyze this image and identify the food ingredients visible. "
                "Based on these ingredients, suggest ONE simple, cheap, and delicious recipe "
                "that can be cooked with basic equipment (like an induction stove or kettle). "
                "Format your response exactly like this:\n"
                "Recipe Name: [Name]\n"
                "Steps: [Numbered list of steps]"
            )

            # 3. Send to Gemini
            response = model.generate_content([prompt, image])
            text = response.text

            # 4. Clean up the text to separate Name and Steps
            # (Simple parsing logic)
            recipe_name = "Chef Gemini's Suggestion"
            steps = text
            
            if "Recipe Name:" in text:
                parts = text.split("Steps:")
                if len(parts) == 2:
                    recipe_name = parts[0].replace("Recipe Name:", "").strip()
                    steps = parts[1].strip()

            if current_user.is_authenticated:
                new_history = History(
                    user_id=current_user.id,
                    recipe_name=recipe_name,
                    recipe_steps=steps
                )
                db.session.add(new_history)
                db.session.commit()

            return jsonify({
                "recipe": recipe_name, 
                "steps": steps
            })

        except Exception as e:
            error_str = str(e)
            print(f"AI Error: {error_str}")
            
            # Quota Handling / Fallback
            # Check for 429 or "quota" or "exhausted" in the error message
            if "429" in error_str or "quota" in error_str.lower() or "exhausted" in error_str.lower():
                print("Quota exceeded! Switching to Mock Demo Mode.")
                
                # Mock Recipe for Demo
                recipe_name = "Golden Eggy Bread (Demo Mode)"
                steps = (
                    "**Note: AI Quota Exceeded. Showing Demo Recipe.**\n\n"
                    "1. Whisk 2 eggs with a pinch of salt and pepper in a shallow bowl.\n"
                    "2. Dip slices of bread into the egg mixture, ensuring both sides are coated.\n"
                    "3. Heat a pan with a little butter or oil over medium heat.\n"
                    "4. Fry the bread for 2-3 minutes on each side until golden brown.\n"
                    "5. Serve hot with ketchup or your favorite topping!"
                )
                
                # Save Mock data to history so the demo flow works
                if current_user.is_authenticated:
                    new_history = History(
                        user_id=current_user.id,
                        recipe_name=recipe_name,
                        recipe_steps=steps
                    )
                    db.session.add(new_history)
                    db.session.commit()

                return jsonify({
                    "recipe": recipe_name, 
                    "steps": steps
                })

            return jsonify({"error": "Failed to analyze image. Try again."}), 500

    return jsonify({"error": "Unknown error"}), 500

    return jsonify({"error": "Unknown error"}), 500

# --- TRENDING ROUTE ---
@app.route('/trending', methods=['GET'])
def get_trending():
    try:
        # 1. Connect to Google Trends
        pytrends = TrendReq(hl='en-US', tz=360)
        
        # 2. Build Payload: 'Food & Drink' category is ID 71
        # We search for "recipe" or general food queries
        kw_list = ["recipe"] 
        pytrends.build_payload(kw_list, cat=71, timeframe='now 1-d')
        
        # 3. Get Interest Over Time related queries
        related_queries = pytrends.related_queries()
        
        if not related_queries:
             return jsonify([])

        top_queries = related_queries['recipe']['top'] # 'top' or 'rising'
        
        if top_queries is None or top_queries.empty:
            return jsonify([])

        # 4. Format for Frontend
        # We'll mock images since Google Trends doesn't provide them directly easily
        # In a real app, use Unsplash API based on the query term
        
        trending_data = []
        count = 0
        for index, row in top_queries.iterrows():
            if count >= 10: break
            query = row['query']
            score = row['value']
            
            # Simple mock image logic or use a placeholder
            trending_data.append({
                "title": query.title(),
                "score": score,
                "image": f"https://source.unsplash.com/500x300/?{query.replace(' ', ',')}"
            })
            count += 1
            
        return jsonify(trending_data), 200

    except Exception as e:
        print(f"Trends Error: {e}")
        return jsonify({"error": "Failed to fetch trends"}), 500



# --- HISTORY ROUTE ---
@app.route('/history', methods=['GET'])
@login_required
def get_history():
    try:
        if not current_user.is_authenticated:
             return jsonify({'error': 'Unauthorized'}), 401
        
        history_items = History.query.filter_by(user_id=current_user.id).order_by(History.timestamp.desc()).all()
        results = []
        for item in history_items:
            results.append({
                "id": item.id,
                "recipe": item.recipe_name,
                "steps": item.recipe_steps,
                "timestamp": item.timestamp.strftime("%Y-%m-%d %H:%M")
            })
        return jsonify(results), 200
    except Exception as e:
        print(f"History Error: {e}")
        return jsonify({"error": "Failed to fetch history"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Seed Data
        if not User.query.filter_by(username='asdfg@dsa').first():
            hashed_pw = bcrypt.generate_password_hash('12345678').decode('utf-8')
            default_user = User(username='asdfg@dsa', password=hashed_pw)
            db.session.add(default_user)
            db.session.commit()
            print("Default user created: asdfg@dsa")
    # Run on port 5001 to avoid AirPlay conflict
    app.run(debug=True, port=5001)
