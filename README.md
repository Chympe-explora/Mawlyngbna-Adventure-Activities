# Mawlyngbna Adventure — Booking Site

A static booking site for Mawlyngbna adventure activities (canyoning, kayaking,
camping, etc.), built as plain HTML/CSS/JS so it deploys straight to GitHub
Pages — no build step, no server, no database.

## Files

```
index.html    Public booking form
admin.html    Password-protected admin dashboard
config.js     All editable content lives here (prices, contact, packages…)
style.css     Shared styling
app.js        Booking form logic (pricing, validation, WhatsApp handoff)
admin.js      Admin dashboard logic
assets/qr.png Payment QR code image
```

## Deploy to GitHub Pages

1. Create a new GitHub repo and upload every file in this folder (keep the
   `assets/` folder as-is).
2. In the repo, go to **Settings → Pages**, set **Source** to your default
   branch (e.g. `main`) and folder `/ (root)`, then save.
3. GitHub gives you a URL like `https://<username>.github.io/<repo>/` — that's
   your live booking page. `admin.html` lives at
   `https://<username>.github.io/<repo>/admin.html`.

That's it — no other setup needed.

## Editing prices, packages & details

Everything editable lives in `config.js`. There are two ways to change it:

**A. Edit the file directly (simplest, always works).**
Open `config.js` in GitHub's web editor (pencil icon) or locally, change the
values, and commit. The site updates for everyone the moment the commit
lands.

**B. Use the admin dashboard.**
Go to `/admin.html` and log in with the password set in `config.js`
(`adminPassword`, default `mawlyngbna2026` — change this immediately after
your first deploy). From there you can:

- Edit the title, subtitle and footer text
- Edit the WhatsApp number, UPI ID, bank details, and upload a new QR image
- Add, edit, remove, or highlight ("Popular") packages
- Add, edit, remove, or hide add-ons (Home Stay, Camping, or new ones), and
  choose whether each is a flat price or charged per person
- Change the child-pricing percentage
- Change the admin password

**Important — this is a static site, so there's no database.** Clicking
**Save preview** stores your changes in that browser's local storage only, so
you can see and test them live before publishing. To make changes visible to
every visitor, click **Export config.js**, then upload/commit the downloaded
file over the existing `config.js` in your GitHub repo (GitHub's web editor
lets you drag-and-drop a replacement file straight in). You can also
**Import** a previously exported file to continue editing it later.

The admin password is a simple client-side check — good enough to keep casual
visitors out, but visible to anyone who reads the page source. Don't rely on
it for anything sensitive.

## How booking works for visitors

1. Visitor fills in their name, WhatsApp number, date, group size, package,
   add-ons and any special request. A live summary shows the estimated total.
2. They pick a payment method (UPI ID, bank transfer, or QR code) and can tap
   **Copy** on the UPI ID / account number / IFSC, or **Download QR code**.
3. After paying, they tap **Confirm booking on WhatsApp**. This opens
   WhatsApp (web or app) to your number with a pre-filled message containing
   every detail of their booking — they just review and hit send. Nothing is
   booked until they actually send the message.

## Finding the admin dashboard

There's a small, unlabeled dot in the bottom-right of the site footer that
links to `admin.html` — or just visit `/admin.html` directly. It isn't linked
anywhere else on the public site.

## Local preview

Any static file server works, e.g. from this folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.
