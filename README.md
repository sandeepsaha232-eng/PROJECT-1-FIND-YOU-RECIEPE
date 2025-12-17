# 🍳 Hostel Chef - Developer Manual

Welcome to the **Hostel Chef** project! This application is designed to help students and cooking enthusiasts generate creative recipes from simple ingredients using AI.

## 🚀 Project Overview

Hostel Chef is a **Full-Stack Web Application** that leverages **Google's Gemini AI** to analyze images of ingredients and suggest recipes. It features a modern, "premium" dark-mode UI, user authentication via Google, and personalized features like Favorites and History.

### Key Features
*   **📸 AI Recipe Generation**: Upload a photo of ingredients, and Gemini AI suggests a recipe.
*   **🤖 Smart Fallback**: If the AI quota is exceeded, the system automatically switches to a "Demo Mode" to prevent crashes.
*   **🔐 Google Authentication**: Secure login using Google Identity Services (GIS) with JWT verification on the backend.
*   **❤️ Favorites**: Save your favorite generated recipes locally (persisted in `localStorage`).
*   **clock History**: Automatically tracks every recipe you generate (persisted in SQLite Database).
*   **📈 Trending Now**: Fetches real-time trending food queries from Google Trends.
*   **🎨 Premium UI**: Glassmorphic styling, smooth animations, and a responsive design.

---

## 🛠 Tech Stack

### Frontend
*   **HTML5 / CSS3**: Custom `style.css` with CSS variables, animations, and glassmorphism.
*   **JavaScript (Vanilla)**: DOM manipulation, `fetch` API for backend communication, and GIS integration.
*   **Libraries**: FontAwesome (Icons).

### Backend
*   **Python (Flask)**: Lightweight web server.
*   **Flask-SQLAlchemy**: ORM for SQLite database.
*   **Flask-Login**: Session management.
*   **Google Generative AI SDK**: For Gemini Vision API.
*   **Pytrends**: For fetching Google Trends data.

### Database
*   **SQLite**: Simple file-based database stored in the user's home directory (`~/hostel_chef_db.sqlite`) to avoid development server restarts.

---

## 📂 Project Structure

```text
hackathon-second-project/
├── backend/
│   └── hostel_chef/
│       ├── app.py              # Main Flask Application Entry Point
│       └── templates/          # Flask Templates (Login/Register)
├── frontend/
│   ├── index.html              # Main Single Page Application (SPA) structure
│   ├── style.css               # Global Styling (Premium Dark Theme)
│   ├── script.js               # Frontend Logic (API calls, UI switching)
│   └── assets/                 # Images and icons
└── check_models.py             # Utility to check available Gemini models
```

---

## ⚙️ Setup & Installation

### 1. Backend Setup
Navigate to the backend directory and activate your virtual environment.

```bash
# Install dependencies
pip install flask flask-sqlalchemy flask-login flask-cors google-generativeai pytrends pillow flask-bcrypt requests

# Run the Server
python backend/hostel_chef/app.py
```
*The server runs on `http://127.0.0.1:5001`.*

### 2. Frontend Setup
The frontend is built to be served statically or via a simple server. Since the backend handles the API, you can open `frontend/index.html` directly or serve it using Live Server.

---

## 🔌 API Documentation

### Auth
*   `POST /google_login`: Verifies Google JWT token and creates a session.
*   `POST /login`: Standard username/password login.
*   `POST /register`: Create a new account.
*   `GET /logout`: Ends the session.
*   `GET /status`: Check if the user is logged in.

### Core Features
*   `POST /suggest`: Accepts an image upload. Returns a generated recipe JSON.
    *   *Note: Automatically saves to History if logged in.*
    *   *Note: Returns Mock Data if AI Quota is hitting 429.*
*   `GET /trending`: Returns top trending food queries from Google.
*   `GET /history`: Returns the logged-in user's past generations.

---

## 💻 Developer Notes

### Favorites Logic
Favorites are currently stored in the browser's `localStorage` under the key `myAppFavorites`. This allows for fast access without API calls but stays on the specific device.

### History Logic
History is stored in the server-side SQLite database. The `loadHistory()` function in `script.js` fetches this data and renders it using the `.premium-card` CSS class.

### UI Customization
The design relies heavily on `style.css`.
*   **Premium Cards**: Use the `.premium-card` class.
*   **Grid Layout**: Use `.premium-grid`.
*   **Animations**: utility classes like `.animate-up` and `.delay-1`.

---

Happy Coding! 👨‍🍳
