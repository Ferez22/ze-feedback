# Feedback Backend

Simple Flask backend to receive feedback from the `@ze-company/ze-feedback` widget.

## Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

The server will start on `http://localhost:5005`

## Endpoints

- **POST** `/api/feedback` - Receive feedback

  - Accepts JSON payload with: `feedback`, `rating`, `userId`, `metadata`, `createdAt`
  - Returns success response with the received data

- **GET** `/api/ping` - Health check
  - Returns `{ "status": "ok", "message": "Backend is running!" }`

## Example Request

```bash
curl -X POST http://localhost:5005/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Great app!",
    "rating": 5,
    "userId": "user-123",
    "metadata": { "page": "/dashboard" },
    "createdAt": "2025-10-30T12:00:00Z"
  }'
```

## CORS

CORS is enabled for all origins to allow frontend requests during development.
