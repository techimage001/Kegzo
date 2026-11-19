# Kegzo

Kegel training game for men. Static site + one-page app + small PHP backend.
The repo root is the web root: Hostinger auto-deploys `main` into `public_html`.

## Build
```
node tools/build.js   # regenerates every page, sitemap, robots, manifest, sw.js and app.html
node tools/tests.js   # QA checks: links, sitemap, titles, banned wording, FAQ schema parity
```
Edit sources in `src/` (app, exercise data, guides) and `tools/build.js` (pages, head, nav, footer). Never hand-edit generated HTML.
Bump `V` in `tools/build.js` when CSS, fonts or images change (cache busting).

## One-time server setup (sign-up, contact form, admin)
1. In hPanel > Emails, create a mailbox on the domain, for example hello@kegzo.com.
2. In File Manager, open the folder that CONTAINS `public_html` (`domains/<your-domain>/`) and create a folder `kegzo_private`.
3. Copy `SECRETS-TEMPLATE.php` into it as `secrets.php` and fill in the values.
4. Admin: `https://<your-domain>/api/admin.php` (usage counts, sign-ups, messages, CSV export).

The site works without `secrets.php`; sign-up and contact just show a friendly "not switched on yet" message.
