# @ze/ze-feedback

A lightweight, type-safe feedback widget for React apps. Built with Radix UI, Zod, and Tailwind v4.

### Why use it?

- Type-safe payload with Zod validation
- Accessible dialog (Radix UI)
- Optional 1–5 star rating
- Tiny API, sensible defaults, themeable
- CSS auto-included (no extra imports)

## Installation

```bash
npm install @ze/ze-feedback
# peer deps (if you don't already have them)
npm install react react-dom
```

## Quick start

```tsx
import { FeedbackWidget } from "@ze/ze-feedback";

export default function App() {
  return <FeedbackWidget apiUrl="/api/feedback" />;
}
```

The styles are included automatically from the package entrypoint.

## Props

```ts
type Theme = "light" | "dark";

interface FeedbackWidgetProps {
  apiUrl: string; // required: POST endpoint for feedback
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
}
```

## Behavior

- Clicking the trigger opens an accessible modal titled “Send Feedback”.
- The form contains a textarea and an optional 1–5 star rating.
- On submit:
  - Payload is validated with Zod.
  - A POST request is sent to `apiUrl`.
  - On success: dialog closes immediately, a short success toast appears, `onSuccess` is called.
  - On failure: an error toast appears, `onError` is called with the `Error` instance.
- The payload automatically includes `createdAt` (ISO string), plus any `userId`/`metadata` you provide.

### Payload shape (sent to `apiUrl`)

```ts
{
  feedback: string;              // 1–2000 chars
  rating?: number;               // 1–5
  userId?: string;               // optional
  metadata?: Record<string, any>;// optional
  createdAt: string;             // ISO 8601
}
```

You can also import the schema and types:

```ts
import { feedbackPayloadSchema } from "@ze/ze-feedback";
import type { FeedbackPayload, FeedbackWidgetProps } from "@ze/ze-feedback";
```

## Examples

### Minimal

```tsx
<FeedbackWidget apiUrl="/api/feedback" />
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

## Backend example

Express-style handler:

```ts
app.post("/api/feedback", async (req, res) => {
  const result = feedbackPayloadSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Invalid feedback data", details: result.error.errors });
  }

  // persist result.data ...
  return res.json({ ok: true });
});
```

## Notes

- This package treats `react` and `react-dom` as peer dependencies.
- When developing locally via `npm link` with Vite/Next:
  - Make sure there is only one copy of React loaded.
  - In Vite, set `resolve.dedupe = ['react','react-dom']`.
  - In Next, set `transpilePackages: ['@ze/ze-feedback']`.

## License

MIT
