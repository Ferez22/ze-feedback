# ze-feedback

A lightweight, type-safe feedback widget for React apps. Built with Radix UI, Zod, and Tailwind v4.

### Why use it?

- Type-safe payload with Zod validation
- Accessible dialog (Radix UI)
- Optional 1–5 star rating
- Tiny API, sensible defaults, themeable
- CSS auto-included (no extra imports)
- Dashboard component to view all feedback
- Dashboard button to navigate to feedback dashboard

## Installation

```bash
npm install ze-feedback
# peer deps (if you don't already have them)
npm install react react-dom
```

## Quick start

```tsx
import { FeedbackWidget } from "ze-feedback";
import "ze-feedback/styles.css";

export default function App() {
  return <FeedbackWidget apiUrl="/api/feedback" />;
}
```

The styles must be imported from `ze-feedback/styles.css`.

## Components

### FeedbackWidget

The main feedback widget that displays a trigger button and handles feedback submission.

### ZeDashboard

A full-page dashboard component to view all feedback submissions with ratings, messages, and metadata.

### ZeDashboardButton

A button component that navigates to your feedback dashboard page.

## FeedbackWidget Props

```ts
type Theme = "light" | "dark";

interface FeedbackWidgetProps {
  apiUrl?: string; // POST endpoint for feedback (required if onSubmit not provided)
  userId?: string; // optional user identifier
  metadata?: Record<string, any>; // optional extra context
  onSuccess?: () => void; // called after successful submission
  onError?: (err: Error) => void; // called when submission fails
  theme?: Theme; // visual theme of the widget (default: "light")

  // Optional toast renderer. If provided, your element replaces the default toast.
  // Example signature: (info) => <MyToast type={info.type} message={info.message} />
  renderToast?: (info: {
    type: "success" | "error";
    message: string;
  }) => React.ReactNode;

  // Trigger button appearance
  // - "standAlone": circular pill with strong contrast (default)
  // - "simple": minimal button that inherits surrounding context
  buttonVariant?: "standAlone" | "simple";

  // Optional custom icon for the trigger button (primarily for simple variant)
  buttonIcon?: React.ReactNode;

  // Custom submit handler (takes precedence over apiUrl)
  onSubmit?: (data: FeedbackPayload) => Promise<void> | void;

  // Custom validation schema (defaults to feedbackPayloadSchema)
  validateWith?: ZodTypeAny;
}
```

## ZeDashboard Props

```ts
interface ZeDashboardProps {
  apiUrl: string; // GET endpoint to fetch feedback list (required)
  theme?: Theme; // visual theme (default: "light")
  title?: string; // dashboard title (default: "Feedback Dashboard")
  backRoute?: string; // route path for back button navigation
  onBack?: () => void; // custom back navigation handler (takes precedence over backRoute)
}
```

## ZeDashboardButton Props

```ts
interface ZeDashboardButtonProps {
  routePath?: string; // route path to navigate to (default: "/ze-dashboard")
  theme?: Theme; // visual theme (default: "light")
  variant?: ButtonVariant; // "standAlone" | "simple" (default: "standAlone")
  icon?: React.ReactNode; // custom icon
  children?: React.ReactNode; // custom button content
  onClick?: () => void; // custom click handler (for framework-specific routing)
  className?: string; // additional CSS classes
}
```

## Behavior

- Clicking the trigger opens an accessible modal titled "Send Feedback".
- The form contains a textarea and an optional 1–5 star rating.
- On submit:
  - Payload is validated with Zod.
  - A POST request is sent to `apiUrl` (or custom `onSubmit` handler is called).
  - On success: dialog closes immediately, a short success toast appears, `onSuccess` is called.
  - On failure: an error toast appears, `onError` is called with the `Error` instance.
- The payload automatically includes `createdAt` (ISO string), plus any `userId`/`metadata` you provide.

### Payload shape (sent to `apiUrl`)

```ts
{
  message: string;              // 1–2000 chars
  rating?: number;               // 1–5
  userId?: string;               // optional
  metadata?: Record<string, any>;// optional
}
```

### Feedback item shape (returned from GET endpoint)

```ts
{
  id?: string;                  // unique identifier
  message: string;              // feedback message
  rating?: number;               // 1–5
  userId?: string;               // optional
  metadata?: Record<string, any>;// optional
  createdAt?: string;           // ISO 8601 timestamp
}
```

You can also import the schema and types:

```ts
import { feedbackPayloadSchema, ratingSchema } from "ze-feedback";
import type {
  FeedbackPayload,
  Rating,
  ZeDashboardProps,
  ZeDashboardButtonProps,
} from "ze-feedback";
```

## Examples

### Minimal FeedbackWidget

```tsx
import { FeedbackWidget } from "ze-feedback";
import "ze-feedback/styles.css";

<FeedbackWidget apiUrl="/api/feedback" />;
```

### With metadata and hooks

```tsx
<FeedbackWidget
  apiUrl="/api/feedback"
  userId="user-123"
  metadata={{ page: "/dashboard", plan: "pro" }}
  onSuccess={() => console.log("Thanks!")}
  onError={(e) => console.error(e)}
/>
```

### Dark theme

```tsx
<FeedbackWidget apiUrl="/api/feedback" theme="dark" />
```

### Custom toast

```tsx
<FeedbackWidget
  apiUrl="/api/feedback"
  renderToast={({ type, message }) => (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        padding: "10px 14px",
        borderRadius: 8,
        color: "#fff",
        background: type === "success" ? "#16a34a" : "#ef4444",
        boxShadow: "0 6px 18px rgba(0,0,0,.2)",
        zIndex: 9999,
      }}
      role="alert"
    >
      {message}
    </div>
  )}
/>
```

### Button variants

```tsx
// Standalone (default): circular, high contrast
<FeedbackWidget apiUrl="/api/feedback" />

// Simple: minimal button (inherits context)
<FeedbackWidget
  apiUrl="/api/feedback"
  buttonVariant="simple"
  buttonIcon={<YourIcon className="w-4 h-4" />}
/>
```

### Custom submit handler

```tsx
<FeedbackWidget
  onSubmit={async (data) => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }}
/>
```

### ZeDashboard with React Router

```tsx
import { ZeDashboard } from "ze-feedback";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <ZeDashboard
      apiUrl="http://localhost:5005/api/feedback/list"
      onBack={() => navigate("/")}
      title="Feedback Dashboard"
      theme="light"
    />
  );
}
```

### ZeDashboard with simple routing

```tsx
import { ZeDashboard } from "ze-feedback";

<ZeDashboard
  apiUrl="http://localhost:5005/api/feedback/list"
  backRoute="/"
  title="Feedback Dashboard"
/>;
```

### ZeDashboardButton with React Router

```tsx
import { ZeDashboardButton } from "ze-feedback";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <ZeDashboardButton
      onClick={() => navigate("/ze-dashboard")}
      theme="light"
      variant="simple"
    />
  );
}
```

### ZeDashboardButton with simple routing

```tsx
import { ZeDashboardButton } from "ze-feedback";

<ZeDashboardButton routePath="/ze-dashboard" theme="light" />;
```

### Complete example with React Router

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackWidget, ZeDashboard, ZeDashboardButton } from "ze-feedback";
import { useNavigate } from "react-router-dom";
import "ze-feedback/styles.css";

function App() {
  const navigate = useNavigate();
  return (
    <div>
      <FeedbackWidget apiUrl="http://localhost:5005/api/feedback" />
      <ZeDashboardButton onClick={() => navigate("/ze-dashboard")} />
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <ZeDashboard
      apiUrl="http://localhost:5005/api/feedback/list"
      onBack={() => navigate("/")}
    />
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ze-dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Backend Setup

### Flask Backend Example

Create a Python backend with Flask:

```python
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

        # Return success response
        return jsonify({
            "success": True,
            "message": "Feedback received successfully!",
            "data": feedback_item
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route("/api/feedback/list", methods=["GET"])
def get_feedback_list():
    """
    Endpoint to get the list of feedback for the dashboard
    Returns feedback sorted by newest first
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
    app.run(host="0.0.0.0", port=5005, debug=True)
```

**Install Flask:**

```bash
pip install flask flask-cors
```

**Run the server:**

```bash
python app.py
```

The server will start on `http://localhost:5005`

### Express.js Backend Example

```ts
import express from "express";
import cors from "cors";
import { feedbackPayloadSchema } from "ze-feedback";

const app = express();
app.use(cors());
app.use(express.json());

const feedbackList: FeedbackItem[] = [];

app.post("/api/feedback", async (req, res) => {
  const result = feedbackPayloadSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Invalid feedback data", details: result.error.errors });
  }

  const feedbackItem = {
    id: crypto.randomUUID(),
    ...result.data,
    createdAt: new Date().toISOString(),
  };

  feedbackList.push(feedbackItem);

  return res.json({ success: true, data: feedbackItem });
});

app.get("/api/feedback/list", (req, res) => {
  const sortedFeedback = feedbackList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return res.json({ success: true, data: sortedFeedback });
});

app.listen(5005, () => {
  console.log("Server running on http://localhost:5005");
});
```

### Required Endpoints

#### POST `/api/feedback`

Receives feedback submissions from the `FeedbackWidget`.

**Request Body:**

```json
{
  "message": "Great app!",
  "rating": 5,
  "userId": "user-123",
  "metadata": { "page": "/dashboard" }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Feedback received successfully!",
  "data": {
    "id": "uuid-here",
    "message": "Great app!",
    "rating": 5,
    "userId": "user-123",
    "metadata": { "page": "/dashboard" },
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

#### GET `/api/feedback/list`

Returns all feedback for the dashboard component.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "message": "Great app!",
      "rating": 5,
      "userId": "user-123",
      "metadata": { "page": "/dashboard" },
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

The dashboard component expects either:

- An array directly: `[...]`
- An object with `data` property: `{ "data": [...] }`
- An object with `feedback` property: `{ "feedback": [...] }`

## Notes

- This package treats `react` and `react-dom` as peer dependencies.
- When developing locally via `npm link` with Vite/Next:
  - Make sure there is only one copy of React loaded.
  - In Vite, set `resolve.dedupe = ['react','react-dom']`.
  - In Next, set `transpilePackages: ['ze-feedback']`.
- The dashboard component automatically handles different response formats and sorts feedback by newest first.
- All components support light and dark themes via the `theme` prop.

## License

MIT
