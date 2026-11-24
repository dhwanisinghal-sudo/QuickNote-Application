# QuickNote – Personal Notes Manager

A full-stack notes application built with HTML, CSS, JavaScript, Python Flask, and SQLite.

## Features
- Create, view, search, edit, and delete notes
- Flask REST API for frontend/backend communication
- SQLite database for persistent storage
- Responsive user interface
- Input validation and safe HTML rendering

## Requirements
- Python 3.9 or later
- pip

## Run locally
1. Extract the project ZIP and open the `QuickNote_Application` folder in VS Code.
2. Open the VS Code terminal in this folder.
3. (Recommended) Create and activate a virtual environment:

   **Windows PowerShell**
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

4. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

5. Start the app:
   ```powershell
   python app.py
   ```

6. Open this address in your browser:
   `http://127.0.0.1:5000`

The `notes.db` SQLite database is created automatically when the app starts. Keep it in the project folder so saved notes remain available.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | Retrieve all notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/<id>` | Update a note |
| DELETE | `/api/notes/<id>` | Delete a note |
