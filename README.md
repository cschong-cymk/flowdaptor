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

Static HTML for everything except the contact form, which posts to a small PHP handler (`contact/send.php`) that delivers mail via [Symfony Mailer](https://symfony.com/doc/current/mailer.html). Shared design system in `assets/site.css`. No JS framework, no build step on the front end.

**Runtime requirements**

- Apache with `mod_rewrite` enabled and `AllowOverride All` for the vhost (the root `.htaccess` strips `index.html` and adds trailing slashes).
- PHP **8.1+** with the `openssl` extension (required by Symfony Mailer for STARTTLS / TLS).
- An SMTP relay you can authenticate to (SES, SendGrid, Postmark, Mailgun, Gmail SMTP, your own MTA…).

## Clean URLs

`.htaccess` at the repo root:

- 301-redirects `/<anything>/index.html` → `/<anything>/`
- Adds a trailing slash on directory requests
- Blocks direct access to `.env`, `composer.*`, `.htaccess`, and anything under `/vendor/`

All HTML files use trailing-slash links (`../products/`, `../contact/`, etc.). Don't write `index.html` in hrefs going forward.

## Contact form — local setup

```bash
# 1. install PHP dependencies (run on the server, or locally for testing)
composer install

# 2. create your local env
cp .env.example .env

# 3. edit .env and set at minimum:
#    MAILER_DSN   — e.g. smtp://user:pass@smtp.example.com:587
#    MAIL_FROM    — verified sender, e.g. "FlowDaptor <no-reply@flowdaptor.com>"
#    MAIL_TO      — recipient, e.g. enterprise@flowdaptor.com
```

The DSN format is the one [Symfony Mailer accepts](https://symfony.com/doc/current/mailer.html#using-built-in-transports). A few common ones:

| Provider     | DSN                                                              |
| ------------ | ---------------------------------------------------------------- |
| Generic SMTP | `smtp://user:pass@smtp.example.com:587`                          |
| Amazon SES   | `smtp://AKIA...:secret@email-smtp.ap-southeast-1.amazonaws.com:587` |
| SendGrid     | `smtp://apikey:SG.xxx@smtp.sendgrid.net:587`                     |
| Postmark     | `smtp://<token>:<token>@smtp.postmarkapp.com:587`                |
| Mailgun      | `smtp://postmaster@<domain>:<pass>@smtp.mailgun.org:587`         |

`MAIL_REPLY_TO` is optional — when blank, replies go to whatever email the visitor entered.

## Deploying

1. Upload the repository contents to the web root (or a vhost root).
2. SSH in and run `composer install --no-dev --optimize-autoloader` once.
3. Copy `.env.example` → `.env` on the server and fill in production SMTP credentials. **Do not commit `.env`.**
4. Make sure the web user can read `.env` and `/vendor/`.
5. Verify in a browser: submit the form, look for a successful 303 → `/contact/?sent=1` with the green banner.

If sending fails the user sees a red banner and the underlying exception goes to the PHP error log (Symfony Mailer's `TransportException` message).

## Form security

- CSRF surface is minimal (single POST endpoint, no cookies, no session).
- A hidden `website` honeypot field traps naive bots — if filled, we pretend to succeed.
- Server-side validation: required `name`, `message`, RFC-valid `email`, enum-checked `interest`.
- `.htaccess` blocks `.env` and `/vendor/` from being served.

## Roadmap

- **Blog section** (`/blog/`) — case studies, technical write-ups on n8n + agentic patterns, Singapore SME automation playbooks, and product launch notes for FlowDaptor 1.0 and OpenClaw
- Real video for homepage hero (currently a placeholder)
- Add product detail pages under `/products/[slug]/`
- Rate-limit `contact/send.php` (e.g. Apache `mod_evasive` or a fail2ban filter)
- Performance pass: image optimisation, lazy-load below-fold sections

## Authorship

v1 authored by **TAN MENG WEE**.

© 2026 FlowDaptor Pte. Ltd.
