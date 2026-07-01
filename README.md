# flowdaptor.ai

Marketing site for **FlowDaptor Pte. Ltd.** — a Singapore-based AI automation studio building production-grade n8n agents and a growing portfolio of agentic products.

## Pages

- `/` — Homepage with hero, infographic, problem framing, platform, use cases
- `/products/` — Flagship **FlowDaptor 1.0** AI e-commerce engine + suite of agentic teams (incl. **OpenClaw** brokerage platform)
- `/workflow/` — Workflow library catalogue
- `/enterprise/` — Enterprise engagements, three-tier pricing (Basic / Pro / Enterprise)
- `/training/` — Hands-on n8n and agentic AI workshops
- `/blog/` — Case studies, build logs, and field notes; one directory per post (`/blog/<slug>/`), each post a standalone page with its own scoped `<style>` block. Some posts embed TikTok videos (`tiktok.com/embed.js`).
- `/store/` — Buy individual agent JSONs
- `/about/` — Team, principles, recognition
- `/contact/` — Enquiry form (PHP + Symfony Mailer over SMTP)

## Stack

Static HTML for everything except the contact form, which posts to a small PHP handler on another server (https://send.flowdaptor.ai/send.php). Form validation with Javascript. CSS fix to hide the form banners 1) `#fd-form-success` and 2) `#fd-form-error`. Shared design system in `assets/site.css`. Website max-width: 1200px.

Cache busting — update the text after `?v=` manually with the current date/time:

```html
<!-- Update the text after '?v=' manually with the current date/time -->
<link rel="stylesheet" href="../assets/site.css?v=20260609-2130">
```

## Clean URLs

- 301-redirects `/<anything>/index.html` → `/<anything>/`
- Adds a trailing slash on directory requests

All HTML files use trailing-slash links (`../products/`, `../contact/`, etc.). Don't write `index.html` in hrefs going forward.

## Deploying

1. Upload the repository contents to the web root (or a vhost root).

## Form security

- CSRF surface is minimal (single POST endpoint, no cookies, no session).
- A hidden `website` honeypot field traps naive bots — if filled, we pretend to succeed.
- Javascript validation: required `name`, `message`, RFC-valid `email`, enum-checked `interest`.

## Blog

Live since June 2026. Current posts:

- `linyan-vs-ltx/` — Seedance 2.0 (linyan.io) vs LTX-2.3 Pro, same prompt; second-character rendering failure + Pika same-model observation (July 2026)
- `linyan-stress-test/` — Breaking linyan.io with a fantasy feature film (June 2026)
- `ai-three-times-before-lunch/` — Field notes from Yishun (June 2026)
- `jade-tithe/` — Sagelion case study, OpenClaw pipeline (June 2026)
- `the-future-of-agentic-ai/` — Agentic AI trends (May 2026)

Conventions: newest card first in `/blog/index.html`; card thumbnails live in `assets/` (e.g. `assets/linyan-vs-ltx.png`); post tags follow the `bl-card-tag` pattern (Build Log / Case Study / Field Notes / Trends). Posts naming real public figures or AI-generated likenesses must carry an in-post disclosure paragraph and get legal review before publishing.

## Roadmap

- Real video for homepage hero (currently a placeholder)
- Add product detail pages under `/products/[slug]/`
- Performance pass: image optimisation, lazy-load below-fold sections
- Blog follow-up: publish the Seedance 2.0 diagnostic results (fictional two-character rerun + solo likeness tests) promised in `linyan-vs-ltx/`

## Authorship

v1 authored by **TAN MENG WEE**.

© 2026 FlowDaptor Pte. Ltd.

