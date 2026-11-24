# Deploy HomeCare Plus

The Vercel project `homecare-plus` and its Private Blob store have already been created in the connected team. The project also has its encrypted `JWT_SECRET` and `BLOB_READ_WRITE_TOKEN` environment variables configured. No database or payment-gateway secrets need to be entered.

## One-command deploy

1. Install Node.js 20 or later.
2. Extract this ZIP.
3. Open a terminal in the extracted `homecare-plus` folder.
4. Run:

   ```bash
   ./deploy.sh
   ```

5. Sign in to Vercel when prompted. When asked to link the folder, use the existing `homecare-plus` project in team `sathvik0205s-projects`.
6. The script deploys to Production and prints the resulting URL.

The script runs `npm install`, the API smoke test suite, `vercel login`, `vercel link`, and `vercel deploy --prod`. The static home page is served from `index.html`; `/api/*` is handled by the serverless function.

## Manual equivalent

```bash
npm install
npx vercel login
npx vercel link --project homecare-plus --scope sathvik0205s-projects
npx vercel deploy --prod
```

If Vercel asks whether to overwrite existing project settings, retain the existing project configuration. The environment variables and private storage are already configured on the Vercel project.

## After deployment

Open `/api/health` on the deployed domain. It should return a JSON health response. Then open the site root and sign in with one of the demo accounts from `README.md`.
