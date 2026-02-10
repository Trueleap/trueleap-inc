# TrueLeap Deployment Guide

## Infrastructure Overview

| Component | Value |
|-----------|-------|
| **Platform** | Cloudflare Workers |
| **Cloudflare Account** | Sandip's — `b01357b51e0ceb9e37e2bdf82bbcbc34` |
| **Frontend Worker** | `trueleap-inc` |
| **CMS Worker** | `trueleap-cms` |
| **Zone** | `trueleapinc.com` (Zone ID: `f2e8adbf061e2a861b6feba81a43f394`) |
| **GitHub Repo** | `Trueleap/trueleap-inc` |
| **Frontend** | Astro 5.17 + `@astrojs/cloudflare` adapter |
| **CMS** | Payload CMS 3.75 + Cloudflare D1 + R2 |
| **Access Control** | Cloudflare Access (App ID: `f008e844-6011-4c77-ba7b-774f38055e52`) |

---

## Architecture

```
┌─────────────────────┐                  ┌─────────────────────┐
│   Customer Site     │   REST API       │    Payload CMS      │
│   (CF Worker)       │ ◄─(published)──► │    (CF Worker)       │
│ Prerendered / Static│                  │                      │
│ dev.trueleapinc.com │                  │ cms.trueleapinc.com  │
└─────────────────────┘                  └──────┬──────┬────────┘
                                                │      │      ▲
┌─────────────────────┐   REST API              │      │      │
│   Preview Site      │ ◄─(drafts)──────────────┘      │  livePreview
│   (CF Worker / SSR) │                                │   (iframe)
│ DRAFT_MODE=true     │                                │
│ dev-preview.        │ ◄──────────────────────────────┘
│   trueleapinc.com   │
└─────────────────────┘

    ┌───────────┐  ┌────────────┐              ┌───────────────┐
    │ R2 Bucket │  │ D1 (SQLite)│              │ CF AI/Gateway │
    │ (images)  │  │ (content)  │              │ (PDF extract) │
    └───────────┘  └────────────┘              └───────────────┘
```

---

## Environments

### Frontend (Astro) — Same codebase, deployed twice

| Environment | Domain | Wrangler Env | Mode | Content | Deploys From |
|-------------|--------|-------------|------|---------|--------------|
| **Dev (customer)** | `dev.trueleapinc.com` | `--env dev` | Prerendered (static) | Published | `main` branch + Payload webhook |
| **Preview (editors)** | `dev-preview.trueleapinc.com` | `--env preview` | SSR (`DRAFT_MODE=true`) | Drafts | `main` branch + Payload webhook |
| **Production** | `trueleapinc.com` | _(not configured yet)_ | Prerendered | Published | _(site not ready)_ |

### CMS (Payload)

| Environment | Domain | Wrangler Env | Deploys From |
|-------------|--------|-------------|--------------|
| **Dev** | `cms.trueleapinc.com` | `--env dev` | Manual / CI from `trueleap-cms/` |

---

## DNS Configuration

All domains use **AAAA records** pointing to `100::` (Cloudflare Workers routes proxy address).

| Record | Type | Name | Content |
|--------|------|------|---------|
| Frontend Dev | AAAA | `dev` | `100::` |
| Frontend Preview | AAAA | `dev-preview` | `100::` |
| CMS | AAAA | `cms` | `100::` |

---

## Secrets & Environment Variables

### Frontend Worker Secrets

Set via `npx wrangler secret put <NAME> --env <ENV>`:

| Secret | Purpose |
|--------|---------|
| `PAYLOAD_API_KEY` | API key for Payload CMS REST API |

### Frontend Worker Vars (in `wrangler.toml`)

| Var | Purpose | Dev | Preview |
|-----|---------|-----|---------|
| `PAYLOAD_URL` | Payload CMS base URL | `https://cms.trueleapinc.com` | same |
| `CF_ACCOUNT_ID` | Cloudflare account ID | `b01357b5...` | same |
| `AI_GATEWAY_ID` | AI Gateway name | `trueleap` | same |
| `DRAFT_MODE` | Fetch draft content | _(not set)_ | `"true"` |

### CMS Worker Secrets

Set via `cd trueleap-cms && npx wrangler secret put <NAME> --env <ENV>`:

| Secret | Purpose |
|--------|---------|
| `PAYLOAD_SECRET` | Encryption secret (generate with `openssl rand -hex 32`) |
| `GITHUB_PAT` | GitHub PAT for webhook `repository_dispatch` events |

### CMS Worker Vars

| Var | Purpose |
|-----|---------|
| `FRONTEND_URL` | Customer site URL (for "Open in new tab" preview) |
| `PREVIEW_URL` | Preview site URL (for live preview iframe) |

### GitHub Actions Secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Wrangler authentication for deployment |
| `PAYLOAD_URL` | Payload CMS URL (for static build) |
| `PAYLOAD_API_KEY` | API key for Payload CMS (for static build) |

---

## Deployment

### Frontend — Automatic (GitHub Actions)

Every push to `main` OR Payload `repository_dispatch` event triggers `.github/workflows/deploy.yml`, which runs **two parallel jobs**:

**Job 1: Customer site (`deploy-dev`)**
1. `npm ci`
2. `npm run build` (prerendered, published content)
3. `npx wrangler deploy --env dev`

**Job 2: Preview site (`deploy-preview`)**
1. `npm ci`
2. `DRAFT_MODE=true npm run build` (SSR, draft content)
3. `npx wrangler deploy --env preview`

### Frontend — Manual

```bash
# Customer site
npm run build && npx wrangler deploy --env dev

# Preview site
DRAFT_MODE=true npm run build && npx wrangler deploy --env preview
```

### CMS — Deploy

```bash
cd trueleap-cms
pnpm install
pnpm run deploy
```

This runs migrations, builds with OpenNext, and deploys to Cloudflare Workers.

---

## Content Workflow (Post-Migration)

### Editing (drafts)
1. Log in to Payload admin at `cms.trueleapinc.com/admin`
2. Create/edit content → click **Save Draft**
3. Use **Live Preview** in CMS to see draft changes instantly (iframe loads `dev-preview.trueleapinc.com`)

### Publishing
1. Click **Publish** in Payload admin
2. DraftBanner component triggers GitHub Actions `repository_dispatch` event
3. GitHub Actions rebuilds both customer + preview sites (~2-3 min)
4. Deploy status shown in CMS header (Deploying... → Deployed)
5. Published content live on `dev.trueleapinc.com`

No branches, no PRs, no merge conflicts.

---

## Monorepo Structure

```
trueleap-inc/
├── src/                    # Astro frontend
│   ├── components/         # React UI components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages
│   ├── lib/
│   │   └── payload.ts      # Payload REST API client
│   └── middleware.ts        # Minimal /admin redirect
├── public/                 # Static assets
├── scripts/                # Migration scripts
│   ├── migrate-images.ts
│   ├── migrate-collections.ts
│   └── migrate-globals.ts
├── trueleap-cms/           # Payload CMS (separate Next.js app)
│   ├── src/
│   │   ├── collections/    # 10 collections (Users, Media, + 8 content)
│   │   ├── globals/        # 23 globals (page singletons)
│   │   ├── fields/         # Reusable field groups (cta, hero, stat)
│   │   └── payload.config.ts
│   ├── wrangler.jsonc
│   └── package.json
├── wrangler.toml           # Frontend worker config
├── astro.config.mjs
└── package.json
```

---

## Access Control

### Layer 1: Cloudflare Access (network gate)

**App ID:** `f008e844-6011-4c77-ba7b-774f38055e52`

Only authorized team members can reach these paths (via email OTP or SSO):

| Domain | Path | Why |
|--------|------|-----|
| `cms.trueleapinc.com` | `/admin/*` | CMS admin panel |
| `dev-preview.trueleapinc.com` | `/*` (entire domain) | Exposes draft content |
| `dev.trueleapinc.com` | `/admin` | Redirects to CMS |

### Layer 2: Payload Users (app-level auth)

- Payload's built-in `Users` collection handles CMS login
- Each editor has an account in the CMS
- Role-based access can be added via `role` field on Users collection

### Layer 3: API access

- Payload REST API (`/api/*`) has `access.read: () => true` for published content reads
- Draft content also reads publicly — secured by Cloudflare Access on the preview domain
- Build-time fetching uses `PAYLOAD_API_KEY` for authenticated access

---

## Local Development

Run all three services simultaneously:

```bash
# Terminal 1: CMS (port 3000)
cd trueleap-cms && pnpm dev

# Terminal 2: Customer site (port 4321) — prerendered, published content
npm run dev

# Terminal 3: Preview site (port 4322) — SSR, draft content
DRAFT_MODE=true npm run dev -- --port 4322
```

The CMS live preview iframe points to `PREVIEW_URL` (defaults to `http://localhost:4322`).

---

## Troubleshooting

### DNS not resolving

```bash
sudo systemctl restart systemd-resolved
dig dev.trueleapinc.com AAAA
dig cms.trueleapinc.com AAAA
```

### Payload CMS not accessible

- Verify D1 database is created: `cd trueleap-cms && npx wrangler d1 list`
- Check `PAYLOAD_SECRET` is set: `npx wrangler secret list --env dev`
- Check Worker logs in Cloudflare dashboard

### Build fails (content fetch errors)

- Verify `PAYLOAD_URL` and `PAYLOAD_API_KEY` are set in GitHub Actions secrets
- Test the API: `curl https://cms.trueleapinc.com/api/globals/homepage`

### Wrangler deploy issues

```bash
npx wrangler whoami
npx wrangler deploy --env dev --log-level debug
```

### R2 bucket not found

R2 bucket bindings must be repeated in each `[env.*]` section — Wrangler does not inherit top-level bindings.
