# HomeCare Plus

Subscription-based home maintenance platform MVP.

## Live application
https://homecare-plus.vercel.app

## Detailed project report
See [`docs/DETAILED_PROJECT_REPORT.md`](docs/DETAILED_PROJECT_REPORT.md) or the PDF version at [`docs/DETAILED_PROJECT_REPORT.pdf`](docs/DETAILED_PROJECT_REPORT.pdf).

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Customer | `customer@homecareplus.demo` | `Customer@12345` |
| Professional | `pro@homecareplus.demo` | `Pro@12345` |
| Admin | `admin@homecareplus.demo` | `Admin@12345` |

These are demonstration credentials only. Do not reuse these passwords elsewhere.

## Features

- Customer registration and sign-in, subscription plans, simulated checkout, service booking, payment history, cancellation-at-period-end, and reviews.
- Professional onboarding, manual admin approval, availability, job acceptance/decline/completion, estimated earnings, and review visibility.
- Admin overview, professional approvals, plan-price editing, indicative analytics, and dispute/refund simulation.
- Responsive customer, professional, and admin workflows.

## Technology

- Frontend: HTML, CSS, vanilla JavaScript.
- Backend: Node.js serverless API on Vercel.
- Persistence: Vercel Private Blob JSON records.
- Authentication: salted PBKDF2 password hashes and signed expiring session tokens.

**Stack disclosure:** This project is not MERN. It does not use MongoDB, Express, or React. It uses Vercel Private Blob for persistent JSON records and vanilla JavaScript on the frontend.

## Local setup

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run test:smoke`.
4. Configure `BLOB_READ_WRITE_TOKEN` and a strong `JWT_SECRET` in your local environment.
5. Run `npx vercel dev`.

Never commit `.env.local` or real secrets. Payments and refunds are simulated; no real bank or payment gateway is contacted. Renewal reminders are not automatic recurring billing.

## Publish to GitHub

From this project directory, run:

```bash
./publish-to-github.sh
```

The script pushes this source tree to `https://github.com/sathvik0205/homecare-plus`. Git must be installed, your Git author configured, and your GitHub account authenticated for HTTPS pushes.

## Further documentation

- [Product requirements](docs/PRD.md)
- [Technical notes](docs/TECHNICAL.md)
- [Testing checklist](docs/TESTING.md)
- [Deployment instructions](DEPLOY.md)
