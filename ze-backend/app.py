from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# In-memory storage for feedback (in production, use a database)
feedback_list = []


@app.route("/api/feedback", methods=["POST"])
def receive_feedback():
    """
    Endpoint to receive feedback from the widget
    """
    try:
        # Get the JSON data from the request
        feedback_data = request.get_json()
        
        # Add ID and timestamp to the feedback
        feedback_item = {
            "id": str(uuid.uuid4()),
            "message": feedback_data.get("message", ""),
            "rating": feedback_data.get("rating"),
            "userId": feedback_data.get("userId"),
            "metadata": feedback_data.get("metadata", {}),
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }
        
        # Store feedback in the list
        feedback_list.append(feedback_item)
        
        # Log it to console (in production, save to database)
        print("\n" + "="*50)
        print("📝 New Feedback Received!")
        print("="*50)
        print(f"Feedback: {feedback_item.get('message')}")
        print(f"Rating: {feedback_item.get('rating', 'No rating')}/5")
        print(f"User ID: {feedback_item.get('userId', 'Anonymous')}")
        print(f"Metadata: {feedback_item.get('metadata', {})}")
        print("="*50 + "\n")
        
        # Return success response with the received data
        return jsonify({
            "success": True,
            "message": "Feedback received successfully!",
            "data": feedback_item
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route("/api/feedback/list", methods=["GET"])
def get_feedback_list():
    """
    Endpoint to get the list of feedback
    """
    # Return feedback list in reverse chronological order (newest first)
    sorted_feedback = sorted(
        feedback_list,
        key=lambda x: x.get("createdAt", ""),
        reverse=True
    )
    
    return jsonify({
        "success": True,
        "data": sorted_feedback
    }), 200

@app.route("/api/ping", methods=["GET"])
def ping():
    """
    Health check endpoint
    """
    return jsonify({
        "status": "ok",
        "message": "Backend is running!"
    }), 200


if __name__ == "__main__":
    print("🚀 Starting feedback backend server...")
    print("📍 Feedback endpoint: http://localhost:5005/api/feedback")
    print("📍 Health check: http://localhost:5005/api/ping")
    app.run(host="0.0.0.0", port=5005, debug=True)

