# Technical Notes — HomeCare Plus

## Architecture

The frontend is a single-page client served by Vercel. `/api/[[...path]].js` is a Node serverless function that exposes JSON endpoints. Persistent application objects are stored as individual JSON blobs in a Vercel Private Blob store under `homecare-plus/v1/{collection}/{id}.json`.

## Collections

- `users`: customer, professional and admin records; password hashes are never returned to clients.
- `plans`: subscription plan catalogue and admin-maintained pricing.
- `subscriptions`: plan ownership, period, status and renewal date.
- `payments`: simulated subscription payments and refund simulation records.
- `bookings`: requested service, slot, customer, professional and status.
- `reviews`: one review per completed booking.
- `meta`: initialization marker.

## Authentication and authorization

Passwords are hashed with PBKDF2-HMAC-SHA256 and unique salts. The API issues a signed token with an expiry. The token carries a user id/role, but every protected request reloads the user record from private storage. Role checks are enforced in the API, not only by hiding frontend controls.

## Deployment configuration

Required Vercel environment variables:

- `BLOB_READ_WRITE_TOKEN` — generated when the private Blob store is connected to the Vercel project.
- `JWT_SECRET` — high-entropy secret used to sign session tokens.

The project is configured with public deployment access; the private data store is not publicly readable. Do not expose either environment variable to frontend code.

## API conventions

- JSON request and response bodies.
- `Authorization: Bearer <token>` for authenticated endpoints.
- HTTP 400 for invalid inputs, 401 for missing/invalid sessions, 403 for role violations, 404 for missing resources, 409 for duplicate email/review conflicts.
- Payment and refund records are explicitly marked as simulated.

## Production hardening still required

Before using real customer data: add rate limiting and abuse monitoring, improve transactional consistency under concurrent bookings, use an external mail/SMS provider for reminders, add a proper document verification workflow, instrument retention/CAC cohorts, carry out penetration and privacy testing, and integrate a PCI-compliant payment provider using its test mode first.
