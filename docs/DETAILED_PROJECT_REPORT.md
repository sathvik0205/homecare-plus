# HomeCare Plus - Detailed Project Report

**Project type:** Subscription-based home maintenance platform prototype  
**Deployment:** https://homecare-plus.vercel.app  
**Report date:** 24 November 2026

## 1. Executive Summary

HomeCare Plus is a responsive web application prototype for subscription-based home maintenance. It brings customers, service professionals, and administrators into one workflow. Customers can select a care plan, simulate a subscription payment, request a home service, review completed work, and inspect their payment records. Professionals can register, await approval, manage availability, and process assigned jobs. Administrators can approve professionals, update plan pricing, review platform activity, and handle booking disputes through simulated statuses.

The project is an academic MVP. It demonstrates the core product workflows and server-side role restrictions. Payments and refunds are simulated; the application does not move money or integrate with a real payment provider.

## 2. Problem Statement

Home maintenance is often handled through isolated, one-off service requests. This can make costs difficult to predict, preventive servicing easy to forget, and provider quality difficult to assess. HomeCare Plus explores a subscription model that groups routine maintenance benefits with a clear booking and service-status workflow.

## 3. Objectives

- Provide monthly, quarterly, and annual home-care plan options.
- Allow customers to book and track common home services.
- Support professional onboarding and administrator approval.
- Maintain subscription, payment, booking, and review records.
- Give administrators a consolidated view of platform activity.
- Demonstrate role-based access control and persistent server-side data storage.

## 4. User Roles and Functional Modules

### 4.1 Customer

Customers can register and sign in, browse plans and services, complete a simulated checkout, request a service with a preferred date/time and address, view booking and payment history, cancel a subscription at the end of its recorded period, and rate a completed booking.

### 4.2 Service Professional

Professionals can register with service categories and a document-reference field. A professional account requires administrator approval before receiving work. Approved professionals can view assigned requests, accept or decline work, mark accepted work complete, update availability, and view estimated earnings and customer reviews.

### 4.3 Administrator

Administrators can inspect platform metrics, approve or reject professional accounts, edit plan details and prices, review bookings, and process dispute/refund demonstration states. Analytics are indicative MVP metrics rather than a fully instrumented business-intelligence system.

## 5. Subscription Catalogue

| Plan | Billing period | Demonstration price | Example coverage |
|---|---|---:|---|
| Basic Care | Monthly | ₹999 | Cleaning, plumbing inspection, electrical safety check, emergency discount |
| Standard Care | Monthly | ₹1,999 | More cleaning visits, minor plumbing work, electrical visits, quarterly AC servicing |
| Standard Care | Quarterly | ₹5,499 | Quarterly service bundle with increased visit allowance |
| Premium Care | Yearly | ₹14,999 | Priority support concept, regular cleaning, appliance coverage |

These are sample INR amounts for the prototype and can be edited by an administrator. Benefits are represented as product-plan descriptions; operational fulfilment rules would need further specification before a commercial launch.

## 6. Service Booking Workflow

1. A customer signs in and selects a service category.
2. The customer supplies a preferred date/time, service address, and optional notes.
3. The platform stores the booking and makes it available to an eligible approved professional.
4. The professional accepts or declines the request.
5. An accepted job can be marked completed.
6. The customer can submit a rating and feedback after completion.
7. The administrator can inspect the booking and use the dispute/refund demonstration workflow when needed.

The implemented status workflow includes pending, accepted, completed, declined, cancelled, and dispute/refund simulation states.

## 7. Technology Stack and Architecture

- **Frontend:** Responsive HTML, CSS, and vanilla JavaScript in a single-page client (`index.html`).
- **Backend:** Node.js serverless API deployed on Vercel (`api/[[...path]].js`).
- **Persistence:** Vercel Private Blob stores application records as JSON objects. The browser does not directly read the private data store.
- **Authentication:** Passwords are hashed with PBKDF2-HMAC-SHA256 and unique salts. The API issues signed, expiring session tokens. Protected API requests reload the user record and check the role server-side.
- **Hosting:** Vercel, with the application and API served from the deployed project.

**Implementation clarification:** This version does not use MongoDB, Express, or React. It is not a MERN-stack application. The persistence layer is Vercel Private Blob, and the frontend is vanilla JavaScript. This architecture is documented accurately to avoid overstating the implementation.

## 8. Data Design

The application stores records in the following logical collections:

- `users`: customer, professional, and administrator accounts, including password hashes (never returned to clients).
- `plans`: subscription catalogue and administrator-maintained pricing.
- `subscriptions`: customer plan, period, status, and renewal date.
- `payments`: simulated checkout and refund ledger entries.
- `bookings`: requested service, customer, professional, preferred slot, and status.
- `reviews`: rating and feedback associated with a completed booking.
- `meta`: initialization marker and application metadata.

Records are stored as individual JSON blobs under a versioned application prefix in the private Blob store.

## 9. API Overview

The API uses JSON request/response bodies. Authenticated endpoints receive a bearer token in the `Authorization` header. Core routes include:

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Service health check |
| GET | `/api/plans` | Subscription catalogue |
| GET | `/api/services` | Service catalogue |
| POST | `/api/auth/register` | Customer/professional registration |
| POST | `/api/auth/login` | Authentication |
| GET | `/api/me` | Current authenticated user |
| GET | `/api/dashboard` | Role-specific dashboard data |
| POST | `/api/subscriptions/checkout` | Simulated subscription checkout |
| POST | `/api/subscriptions/cancel` | Cancel subscription at period end |
| GET/POST | `/api/bookings` | List/create service bookings |
| PATCH | `/api/bookings/status` | Update booking status |
| PATCH | `/api/professional/availability` | Change availability |
| GET | `/api/payments` | Payment history |
| POST | `/api/reviews` | Review a completed booking |
| GET/PATCH | `/api/admin/professionals` and `/api/admin/professionals/approve` | Professional administration |
| GET | `/api/admin/analytics` | Admin analytics |
| PATCH | `/api/admin/plans/update` | Update plan details/pricing |

## 10. Security and Privacy Measures

- Passwords are stored as salted PBKDF2-HMAC-SHA256 hashes rather than plaintext.
- Session tokens are signed and expire.
- Role enforcement occurs in server-side API handlers; frontend visibility alone is not treated as authorization.
- Private Blob credentials and the token-signing secret are configured as server-side environment variables.
- `.env` files and local secrets are excluded from source control through `.gitignore`.

This is a prototype security baseline, not a substitute for an independent security assessment. Production hardening is still required.

## 11. Testing and Validation

The repository includes an API smoke-test script (`npm run test:smoke`) that runs against a temporary in-memory Blob adapter. The latest recorded local run passed 16 smoke checks. Coverage includes health and catalogues, demo logins, customer dashboard, simulated checkout, booking creation, professional accept/complete actions, customer review, role-based denial of admin access, admin analytics, plan-price update, and payment history.

The deployed site was also checked for successful HTML delivery and a successful `/api/health` response. This smoke suite is useful for MVP regression checks, but it does not replace a full end-to-end test against live private storage, browser/device testing, load testing, or penetration testing.

## 12. Deployment Configuration

The Vercel project uses a private Blob store and requires two server-side environment variables:

- `BLOB_READ_WRITE_TOKEN`: access token for the Vercel Private Blob store.
- `JWT_SECRET`: high-entropy secret used to sign session tokens.

Neither value should be committed to GitHub or exposed in browser code. Deployment instructions are provided in `DEPLOY.md` and `README.md`.

## 13. Limitations and Future Improvements

- UPI, card, and net-banking checkout are simulated; no payment gateway is integrated.
- Refunds, payouts, and payment ledger entries are demonstrations and do not move funds.
- Renewal reminders are displayed, but recurring billing is not automatic.
- Professional verification uses a document-reference field and manual admin approval; no identity-verification provider is integrated.
- JSON Blob persistence is suitable for an MVP demonstration, but concurrent writes and transactional workflows need a database designed for concurrency before production use.
- Add rate limiting, abuse monitoring, transactional booking/payment consistency, notification delivery, audit logs, formal privacy controls, observability, accessibility checks, load testing, and independent security testing.
- Add detailed fulfilment rules, service-area coverage, provider scheduling, cancellation policies, and real payment-provider integration in a later release.

## 14. Conclusion

HomeCare Plus demonstrates an end-to-end prototype for subscription-based home maintenance, including customer, professional, and administrator workflows. It provides persistent server-side records, signed authentication, role-checked APIs, subscription and booking flows, and a smoke-test suite. The project is suitable as an academic MVP demonstration, with its simulated payment model and technical limitations disclosed above.
