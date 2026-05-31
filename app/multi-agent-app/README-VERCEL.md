Deploying to Vercel

This project is a Vite + React app with serverless API functions under api/. Follow these steps to deploy on Vercel (free tier):

1. Create a GitHub repo and push this project.
2. On Vercel, click "Import Project" and connect the GitHub repo.
3. In the Project > Settings > Environment Variables, add:
   - GROQ_API_KEY — your Groq key (do NOT use VITE_ prefix)
   - SUPABASE_URL — your Supabase project URL (optional)
   - SUPABASE_SERVICE_ROLE_KEY — your Supabase service role key (optional)
4. Deploy. Vercel will run `npm run build` and deploy the static site in dist, and expose your serverless functions under /api/*.

Local testing:

Install dependencies and run the dev server:

npm install
npm run dev

To run local serverless functions and approximate Vercel behavior, install the Vercel CLI and use vercel dev:

npm i -g vercel
vercel login
vercel dev

Security notes:
- Ensure you do not commit .env. This project ignores .env in .gitignore.
- Store `GROQ_API_KEY` and Supabase secrets in Vercel Environment Variables only.

If you import this repo from the GitHub root, Vercel will use the root `vercel.json` file and build the nested app in `app/multi-agent-app`.

GitHub Actions auto-deploy

This project includes a GitHub Actions workflow at the repository root in `.github/workflows/vercel-deploy.yml`.
On every push to `main`, the workflow installs dependencies in `app/multi-agent-app`, builds the app, and deploys to Vercel.

To enable it, add these GitHub repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

One-click deploy

Your GitHub repo is `kravindra1415/Multi-agent-app`.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/kravindra1415/Multi-agent-app)

Supabase persistent memory (optional)

To enable persistent conversation storage, create a Supabase project and add a table named `conversations` with columns:

- `id` (uuid, primary key, default: uuid_generate_v4())
- `prompt` (text)
- `answer` (text)
- `created_at` (timestamp with time zone, default: now())

Then add these Environment Variables to Vercel:

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — the service role key (keeps writes secure on the server)

The project contains an API function `api/save-convo.js` which uses the service role key to insert conversations.


