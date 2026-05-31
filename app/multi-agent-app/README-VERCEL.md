Deploying to Vercel

This project is a Vite + React app with serverless API functions under api/. Follow these steps to deploy on Vercel (free tier):

1. Create a GitHub repo and push this project.
2. On Vercel, click "Import Project" and connect the GitHub repo.
3. In the Project > Settings > Environment Variables, add:
   - GROQ_API_KEY — your Groq API key (do NOT use VITE_ prefix)
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
- Ensure you do not commit .env. This project adds .env to .gitignore.
- Store GROQ_API_KEY in Vercel Environment Variables; do not expose it to the browser.

One-click deploy

You can add a one-click deploy button to this README. Replace `OWNER/REPO` with your GitHub repository path.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/OWNER/REPO)

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


