# HomeCare Plus — MVP Test Checklist

Use the three demo accounts listed in the project README. Payment interactions are simulated and never call a payment provider.

## Customer

1. Sign in as `customer@homecareplus.demo`.
2. Confirm the active Basic Care subscription and seeded booking appear.
3. Open plans, select a plan, choose UPI/Card/Net Banking, and complete demo checkout.
4. Book a service for a future date with a full address and optional note.
5. Confirm the booking appears in the customer dashboard and payment history reflects the dummy transaction.
6. Cancel an active subscription; it remains active until its recorded renewal date.
7. After a professional marks a booking complete, submit a 1–5 rating and feedback.

## Professional

1. Sign in as `pro@homecareplus.demo`.
2. Confirm the seeded booking appears in the job list.
3. Accept the booking, then mark it completed.
4. Toggle availability and check the dashboard reflects the new state.
5. Confirm review/rating information appears after a customer submits feedback.

## Admin

1. Sign in as `admin@homecareplus.demo`.
2. Review customer/professional counts, booking counts, active subscriptions, estimated MRR, and ratings.
3. Approve or reject a pending professional account.
4. Edit a subscription plan's price or active state.
5. Move a booking into dispute/refund simulation and confirm a dummy refund ledger entry is recorded.

## Executed local smoke suite

Run `npm run test:smoke`. The suite uses a temporary in-memory implementation of the Vercel Blob API and checks 16 paths/behaviours: health, catalogues, demo logins, seeded customer dashboard, dummy checkout, booking creation, professional accept/complete, customer review, role-based admin denial, admin analytics, plan editing and payment history. It does not replace a live deployment test against Vercel Blob.

## API smoke checks

- `GET /api/health`
- `GET /api/plans`
- `GET /api/services`
- `POST /api/auth/login`
- `GET /api/dashboard` with a bearer token
- `POST /api/subscriptions/checkout` with a customer bearer token
- `POST /api/bookings` with a customer bearer token

## Known limitations

- Payment, refund, payout and renewal billing are simulated; no funds are moved.
- Professional document verification is a reference field plus manual approval.
- The current persistence adapter is Vercel Private Blob JSON records, not MongoDB.
- Single-record JSON writes are suitable for an internship MVP/demo, not high-concurrency production traffic. A transactional database and concurrency-safe data model are required before real launch.
