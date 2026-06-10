# flowdaptor.ai

Marketing site for **FlowDaptor Pte. Ltd.** — a Singapore-based AI automation studio building production-grade n8n agents and a growing portfolio of agentic products.

## Pages

- `/` — Homepage with hero, infographic, problem framing, platform, use cases
- `/products/` — Flagship **FlowDaptor 1.0** AI e-commerce engine + suite of agentic teams (incl. **OpenClaw** brokerage platform)
- `/workflow/` — Workflow library catalogue
- `/enterprise/` — Enterprise engagements, three-tier pricing (Basic / Pro / Enterprise)
- `/training/` — Hands-on n8n and agentic AI workshops
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

## Roadmap

- **Blog section** (`/blog/`) — case studies, technical write-ups on n8n + agentic patterns, Singapore SME automation playbooks, and product launch notes for FlowDaptor 1.0 and OpenClaw
- Real video for homepage hero (currently a placeholder)
- Add product detail pages under `/products/[slug]/`
- Performance pass: image optimisation, lazy-load below-fold sections

## Authorship

v1 authored by **TAN MENG WEE**.

© 2026 FlowDaptor Pte. Ltd.

