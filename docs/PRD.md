# Product Requirements Document — HomeCare Plus

## Product summary

HomeCare Plus is a web platform for subscription-based home maintenance. It aims to make routine upkeep predictable, support preventive servicing and connect customers with approved local professionals.

## Problem

On-demand-only home services can create unpredictable costs, delayed emergency repairs, inconsistent provider quality and missed preventive maintenance. Customers need a clearer way to plan recurring home care and request verified help.

## Goals

1. Offer affordable monthly, quarterly and annual home-care plans.
2. Make booking, assignment and service-status tracking understandable.
3. Provide professional onboarding and admin approval.
4. Make subscription and payment records transparent.
5. Provide an admin view of demand, service completion, subscriptions and provider supply.

## Roles

### Customer
- Register/sign in.
- Browse plans and services.
- Purchase/cancel a subscription using demo checkout.
- Submit a service booking with date, slot, address and notes.
- Track bookings and payment records.
- Review completed service visits.

### Professional
- Register and select service categories.
- Supply a document-reference field for admin review.
- Wait for approval before receiving work.
- Set availability.
- Accept/decline requests and mark accepted visits completed.
- View estimated earnings and customer reviews.

### Admin
- Review and approve professionals.
- Manage plan names, prices, descriptions and active status.
- Review bookings and flag/resolve disputes using demo statuses.
- Inspect subscription, revenue, booking, service rating and commission estimates.

## Subscription catalogue

| Plan | Period | Price (demo) | Included service outline |
|---|---|---:|---|
| Basic Care | Monthly | ₹999 | 1 cleaning, 1 plumbing inspection, 1 electrical safety check, emergency discount |
| Standard Care | Monthly | ₹1,999 | 2 cleanings, minor plumbing fixes, 2 electrical visits, quarterly AC servicing |
| Standard Care | Quarterly | ₹5,499 | Quarterly bundle with higher visit counts |
| Premium Care | Yearly | ₹14,999 | Priority support, dedicated manager concept, regular cleaning and appliance coverage |

The amounts are sample INR values for the MVP and can be edited by an admin.

## Core journeys

1. Customer registers and signs in.
2. Customer selects a plan and completes a simulated checkout.
3. Subscription and payment history are saved.
4. Customer selects a service, preferred date/time and address.
5. An approved professional receives the request.
6. Professional accepts or declines the request, then marks the work complete.
7. Customer leaves a rating and feedback.
8. Admin monitors plans, providers, bookings and platform statistics.

## Non-functional requirements

- Responsive layout for desktop and mobile.
- Server-side role checks for protected API actions.
- Passwords hashed with per-user salts; signed session tokens.
- Persistent application records held in private storage, not browser local storage.
- Errors returned with useful messages and validated request fields.

## Out of scope

Native mobile apps, real payment gateway settlement, automatic recurring charges, identity-provider verification, predictive maintenance, IoT integrations and international expansion.

## Success measures

- Customer sign-in and registration complete.
- Demo purchase creates a subscription and transaction record.
- Booking can be accepted and completed by a professional.
- Completed booking can be rated once.
- Admin can approve professionals and edit plan pricing.
