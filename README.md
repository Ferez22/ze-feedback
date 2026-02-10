# ze-feedback

A lightweight, type-safe feedback widget for React apps — built with Radix UI (Dialog), Zod validation, and shipped styles.

---

## 1) What is this?

`ze-feedback` is a small React component library that gives you:

- A **FeedbackWidget**: button → accessible modal → textarea + optional 1–5 star rating → submit
- A **ZeDashboard**: a simple dashboard UI to list feedback from your API
- A **ZeDashboardButton**: a ready-to-use navigation button
- **Type-safe payloads** + **Zod schemas** you can reuse on the server

You can use it with a simple `apiUrl` prop or take full control using `onSubmit`.

---

## 2) Who is it for?

- Product builders who want a **drop-in feedback button** for internal tools, MVPs, side projects, or SaaS apps
- Teams who want **strongly typed, validated feedback payloads**
- Anyone who wants a **minimal API** and doesn’t want to build a modal + validation + UX from scratch

---

## 3) Why does it exist?

Most feedback widgets are either:

- too heavy / overly customizable, or
- too minimal (no validation / no good UX defaults / no dashboard)

This package exists to provide a **tiny, sensible default feedback flow** with:

- accessibility (Radix Dialog)
- validation (Zod)
- clean UI + theming (`light` / `dark`)
- an optional dashboard to review submissions

---

## Installation

```bash
npm install ze-feedback
# peer deps (if you don't already have them)
npm install react react-dom
```

---

## Quick start

```tsx
import { FeedbackWidget } from "ze-feedback";
import "ze-feedback/styles.css";

export default function App() {
  return <FeedbackWidget apiUrl="/api/feedback" />;
}
```

The styles must be imported from `ze-feedback/styles.css`.

---

## Minimal backend required

At minimum, you need an endpoint that can receive feedback submissions from the widget:

- **POST** `/api/feedback`

Optional (only if you use the dashboard):

- **GET** `/api/feedback/list`

Backend guide (placeholder): **[Minimal backend setup](./BACKEND.md)**

### Payload shape (sent to `apiUrl`)

```ts
{
  message: string;               // 1–2000 chars
  rating?: number;               // 1–5
  userId?: string;               // optional
  metadata?: Record<string, any>;// optional
  createdAt: string;             // ISO string (added by the widget)
}
```

### Feedback item shape (used by dashboard)

```ts
{
  id?: string;
  message: string;
  rating?: number;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;           // ISO 8601 timestamp
}
```

The dashboard accepts any of these response formats:

- an array directly: `[...]`
- or `{ data: [...] }`
- or `{ feedback: [...] }`

---

## Components

### `FeedbackWidget`

The main feedback widget that displays a trigger button and handles feedback submission.

### `ZeDashboard`

A full-page dashboard component to view all feedback submissions with ratings, messages, and metadata.

### `ZeDashboardButton`

A button component that navigates to your feedback dashboard page.

---

## Props (reference)

### FeedbackWidget Props

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

### ZeDashboard Props

```ts
interface ZeDashboardProps {
  apiUrl: string; // GET endpoint to fetch feedback list (required)
  theme?: Theme; // visual theme (default: "light")
  title?: string; // dashboard title (default: "Feedback Dashboard")
  backRoute?: string; // route path for back button navigation
  onBack?: () => void; // custom back navigation handler (takes precedence over backRoute)
}
```

### ZeDashboardButton Props

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

---

## Importable schemas & types

```ts
import { feedbackPayloadSchema, ratingSchema } from "ze-feedback";
import type {
  FeedbackPayload,
  Rating,
  ZeDashboardProps,
  ZeDashboardButtonProps,
} from "ze-feedback";
```

---

## 4) How do I run it locally in 5 minutes?

### Prereqs

- Node.js + npm (recommended: Node 18+)

### A) Clone & run the library in watch mode

```bash
git clone https://github.com/ferez22/ze-feedback.git
cd ze-feedback
npm install
npm run dev
# dev = tsup --watch (rebuilds dist/ on every change)
```

Keep that running.

### B) Create a tiny playground app and link the package

In a new terminal:

```bash
npm create vite@latest ze-feedback-playground -- --template react-ts
cd ze-feedback-playground
npm install
```

Link the local package:

```bash
# from inside the ze-feedback folder (once)
npm link

# from inside ze-feedback-playground
npm link ze-feedback
```

Use it in your app (edit `src/App.tsx`):

```tsx
import { FeedbackWidget } from "ze-feedback";
import "ze-feedback/styles.css";

export default function App() {
  return <FeedbackWidget apiUrl="http://localhost:5005/api/feedback" />;
}
```

Run the playground:

```bash
npm run dev
```

Now edit anything in `ze-feedback/src/*` → `tsup --watch` rebuilds → your playground updates.

### If you use Vite and linking feels “stale”

When using `npm link`, ensure Vite doesn’t prebundle the linked dependency and that you don’t load two React copies:

```ts
// vite.config.ts
resolve: { dedupe: ["react", "react-dom"] },
optimizeDeps: { exclude: ["ze-feedback"] },
```

---

## Examples

### Minimal `FeedbackWidget`

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

### Custom submit handler

```tsx
<FeedbackWidget
  onSubmit={async (data) => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // already validated
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

---

## 5) How can I contribute?

Contributions are welcome — especially bug fixes, docs improvements, and small UX polish.

### Quick contribution workflow

1. Fork the repo and create a branch
1. Install deps:

```bash
npm install
```

1. Run in watch mode while you develop:

```bash
npm run dev
```

1. Before opening a PR, make sure these pass:

```bash
npm run type-check
npm run build
```

### What to include in a PR

- A clear description of the change and why it’s needed
- If it changes behavior/API, update the README examples
- If it changes UI/UX, include before/after screenshots (optional but helpful)

If you’re not sure where to start, open an issue describing what you want to improve.

---

## License

MIT
