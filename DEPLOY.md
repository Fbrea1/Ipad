# iPad Deploy — Step by Step

## 1) Create services
- **Vercel** (new project → import this repo)
- **Supabase** (New project)
  - Settings → Auth → Providers → **Azure**: enable.
  - Add redirect: `https://<your-vercel-url>/`
  - Save the Client ID / Secret from Entra (see below).
- **Microsoft Entra** (Azure Portal → App registrations → New)
  - Redirect URI: `https://<your-vercel-url>/`
  - Under API permissions: add **Microsoft Graph** Delegated:
    - `openid`, `profile`, `email`, `offline_access`, `Calendars.ReadWrite`
  - Grant admin consent.
- **Slack** (api.slack.com → Create App)
  - Slash command `/plan` to `https://<your-vercel-url>/api/slack/command`
  - Scopes: `commands`, `chat:write`, `im:write`
  - Install app to workspace, copy Bot Token & Signing Secret.

## 2) Environment variables (Vercel → Project → Settings → Env Vars)
- `NEXT_PUBLIC_SUPABASE_URL` = from Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = from Supabase
- `SLACK_BOT_TOKEN` = xoxb-…
- `SLACK_SIGNING_SECRET` = …

*(You configure Microsoft provider inside Supabase — no client secret in app code.)*

## 3) First run
- Open the app on iPad Safari → Share → **Add to Home Screen**.
- Tap **Sign in with Microsoft**.
- Go to **Inbox** → add tasks.
- **Today → Auto‑Plan** to generate a schedule.

## 4) Hook Outlook busy times
Replace `/pages/api/plan/today.ts` busy placeholders with Graph:
- Get the access token: `const { data } = await supabase.auth.getSession()` (client) or use server helpers.
- Call Graph `/me/calendarView` (start/end today) to build `busy[]`.
- Write planned blocks back to Outlook with `/me/events`.

See: https://learn.microsoft.com/graph/api/resources/event

## 5) Slack
Point your `/plan` command to `/api/slack/command`. Enhance it to call your `/api/plan/today` and reply via `chat.postMessage`.
